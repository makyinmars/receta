import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { BsFillBookmarksFill, BsBookmarks } from "react-icons/bs";

import { ssrInit } from "src/utils/ssg";
import { trpc } from "src/utils/trpc";
import Spinner from "src/components/spinner";
import Error from "src/components/error";
import Menu from "src/components/menu";

const RecipeId = ({
  id,
  email,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const utils = trpc.useContext();

  const { data: userData } = trpc.user.getUserByEmail.useQuery({
    email,
  });

  const { data, isLoading, isError } = trpc.recipe.getRecipeById.useQuery({
    id,
  });

  const createBookmark = trpc.bookmark.createBookmark.useMutation({
    onSuccess: async () => {
      await utils.user.getUserByEmail.invalidate({ email });
      await utils.bookmark.getBookmarks.invalidate({ userId });
    },
  });

  const removeBookmark = trpc.bookmark.deleteBookmark.useMutation({
    onSuccess: async () => {
      await utils.user.getUserByEmail.invalidate({ email });
      await utils.bookmark.getBookmarks.invalidate({ userId });
    },
  });

  return (
    <Menu user={userData}>
      {isLoading && <Spinner text="Recipe Loading" />}
      {isError && <Error />}
      {data && (
        <div className="flex flex-col gap-4">
          <Head>
            <title>{data.name}</title>
          </Head>
          <h1 className="text-center text-3xl font-bold">{data.name}</h1>
          <div className="flex gap-4">
            <h2 className="custom-subtitle">Description</h2>
            {userData && (
              <>
                {userData.bookmarks.find((bookmark) => {
                  bookmark.recipeId === id;
                }) ? (
                  <BsBookmarks
                    className="h-8 w-8 hover:cursor-pointer"
                    title="Remove this Bookmark"
                    onClick={async () => {
                      try {
                        await removeBookmark.mutateAsync({
                          recipeId: id,
                        });
                      } catch {}
                    }}
                  />
                ) : (
                  <BsFillBookmarksFill
                    className="h-8 w-8 hover:cursor-pointer"
                    title="Bookmark this Recipe"
                    onClick={async () => {
                      try {
                        await createBookmark.mutateAsync({
                          recipeId: id,
                          userId: userData.id,
                        });
                      } catch {}
                    }}
                  />
                )}
              </>
            )}
          </div>
          <hr className="border border-stone-700" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <p className="custom-par">{data.description}</p>
              <p className="custom-par">
                <span className="font-semibold">County:</span> {data.country}
              </p>
              <p className="custom-par">
                <span className="font-semibold">Cook Time:</span>{" "}
                {data.cookTimeMinutes}
              </p>
              <p className="custom-par">
                <span className="font-semibold">Prep Time:</span>{" "}
                {data.prepTimeMinutes}
              </p>
              <p className="custom-par">
                <span className="font-semibold">Video:</span>{" "}
                {data.originalVideoUrl ? (
                  <a href={data.originalVideoUrl}>{data.name}</a>
                ) : (
                  "No Video"
                )}
              </p>
            </div>
            <img
              src={data.thumbnailUrl}
              alt={data.name}
              className="h-96 w-[700px] self-center rounded"
            />
          </div>

          <h2 className="custom-subtitle">Instructions</h2>
          <hr className="border border-stone-700" />
          {data.instructions.map((instruction, i) => (
            <div key={i} className="flex flex-col gap-4">
              <p className="custom-par">
                <span className="font-semibold">Step {i + 1}:</span>{" "}
                {instruction.displayText}
              </p>
            </div>
          ))}

          <h2 className="custom-subtitle">User Ratings</h2>
          <hr className="border border-stone-700" />
          {data.userRatings.map((rating, i) => (
            <div key={i} className="flex justify-between gap-4">
              <p className="custom-par">
                <span className="font-semibold">Positive Rating:</span>{" "}
                {rating.countPositive}
              </p>
              <p className="custom-par">
                <span className="font-semibold">Negative Rating:</span>{" "}
                {rating.countNegative}
              </p>
              <p className="custom-par">
                <span className="font-semibold">Overall Rating:</span>{" "}
                {rating.score}
              </p>
            </div>
          ))}
        </div>
      )}
    </Menu>
  );
};

export default RecipeId;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;
  const id = context.params?.id as string;

  await ssg.recipe.getRecipeById.prefetch({ id });

  if (email) {
    const user = await ssg.user.getUserByEmail.fetch({ email });
    if (user) {
      return {
        props: {
          trpcState: ssg.dehydrate(),
          email,
          id,
          userId: user.id,
        },
      };
    }
  } else {
    return {
      props: {
        trpcState: ssg.dehydrate(),
        email: null,
        userId: null,
        id,
      },
    };
  }
};
