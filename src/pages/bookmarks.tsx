import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import Menu from "src/components/menu";
import { ssrInit } from "src/utils/ssg";
import { trpc } from "src/utils/trpc";
import Spinner from "src/components/spinner";
import Error from "src/components/error";
import { BsBookmarks, BsFillBookmarksFill } from "react-icons/bs";

const Bookmarks = ({
  email,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data: userData } = trpc.user.getUserByEmail.useQuery({
    email,
  });
  const {
    data: bookmarksData,
    isLoading: bookmarksLoading,
    isError: bookmarksError,
  } = trpc.bookmark.getBookmarks.useQuery({ userId });

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
      {userData ? (
        <div className="flex flex-col gap-4">
          <Head>
            <title>
              {userData.name}
              {`'`}s Bookmarks
            </title>
          </Head>
          <h1 className="text-center text-3xl font-bold">
            {userData.name}
            {`'`}s Bookmarks
          </h1>
          {bookmarksLoading && <Spinner text="Bookmarks Loading" />}
          {bookmarksError && <Error />}
          {bookmarksData && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {bookmarksData &&
                bookmarksData.map((recipe, i) => (
                  <div
                    key={i}
                    className="custom-border flex h-80 flex-col items-center justify-between gap-4 rounded bg-white bg-opacity-40 p-4 md:h-auto"
                  >
                    <div className="flex flex-1">
                      <img
                        src={recipe.thumbnailUrl}
                        alt={recipe.name}
                        className="h-40 w-60 self-center rounded md:h-80 md:w-80"
                      />
                    </div>
                    <div>
                      <h2 className="text-center text-lg font-bold">
                        {recipe.name}
                      </h2>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          className="custom-button"
                          onClick={() => router.push(`/recipe/${recipe.id}`)}
                        >
                          View Recipe
                        </button>
                        <>
                          {userData.bookmarks.find(
                            (bookmark) => bookmark.recipeId === recipe.id
                          ) ? (
                            <BsBookmarks
                              className="h-8 w-8 hover:cursor-pointer"
                              title="Remove this Bookmark"
                              onClick={async () => {
                                try {
                                  await removeBookmark.mutateAsync({
                                    recipeId: recipe.id,
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
                                    recipeId: recipe.id,
                                    userId: userData.id,
                                  });
                                } catch {}
                              }}
                            />
                          )}
                        </>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Head>
            <title>Bookmarks</title>
          </Head>
        </div>
      )}
    </Menu>
  );
};

export default Bookmarks;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  if (email) {
    const user = await ssg.user.getUserByEmail.fetch({ email });
    if (user) {
      await ssg.bookmark.getBookmarks.prefetch({ userId: user.id });
      return {
        props: {
          trpcState: ssg.dehydrate(),
          email,
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
      },
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
