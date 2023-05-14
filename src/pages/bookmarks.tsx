import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { FcCheckmark } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";
import { BsFillBookmarksFill } from "react-icons/bs";
import Head from "next/head";
import { useRouter } from "next/router";

import Menu from "src/components/menu";
import { ssrInit } from "src/utils/ssg";
import { trpc } from "src/utils/trpc";
import Spinner from "src/components/spinner";
import Error from "src/components/error";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  const { data: userRecipeIdsData } = trpc.user.getUserRecipeIds.useQuery({
    userId,
  });

  const removeBookmark = trpc.bookmark.deleteBookmark.useMutation({
    onSuccess: async () => {
      await utils.bookmark.getBookmarks.invalidate({ userId });
      await utils.user.getUserRecipeIds.invalidate({ userId });
    },
  });

  return (
    <Menu user={userData}>
      <div>
        <Toaster />
      </div>
      {userData ? (
        <div className="flex flex-col gap-4">
          <Head>
            <title>
              {userData.name}
              {`'`}s Bookmarks
            </title>
          </Head>
          <h2 className="custom-h2 text-center">
            {userData.name}
            {`'`}s Bookmarks
          </h2>
          {bookmarksLoading && <Spinner text="Bookmarks Loading" />}
          {bookmarksError && <Error />}
          {bookmarksData && bookmarksData.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {bookmarksData &&
                bookmarksData.map((recipe, i) => (
                  <Card key={i} className="flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle>{recipe.name}</CardTitle>
                      <CardDescription>
                        {recipe.description === ""
                          ? "No description. We will add it soon. In the meantime, you can bookmark this recipe and come back later. Thank you for your patience."
                          : recipe.description.substring(0, 110).concat("...")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={recipe.thumbnailUrl}
                        alt={recipe.name}
                        className="mx-auto h-40 w-60 self-center rounded md:h-80 md:w-80"
                      />
                    </CardContent>
                    <CardFooter className="flex items-center justify-center gap-4">
                      <Button
                        onClick={() => router.push(`/recipe/${recipe.id}`)}
                      >
                        View Recipe
                      </Button>
                      <>
                        {userRecipeIdsData &&
                          userRecipeIdsData.includes(recipe.id) && (
                            <div className="flex items-center gap-2">
                              <BsFillBookmarksFill
                                className="h-8 w-8 hover:cursor-pointer"
                                title="Remove From My Bookmarks"
                                onClick={async () => {
                                  try {
                                    await toast.promise(
                                      removeBookmark.mutateAsync({
                                        recipeId: recipe.id,
                                      }),
                                      {
                                        loading: (
                                          <p>
                                            Removing{" "}
                                            <span className="font-bold">
                                              {recipe.name}
                                            </span>{" "}
                                            from your Bookmarks...`
                                          </p>
                                        ),
                                        success: (
                                          <p>
                                            <span className="font-bold">
                                              {recipe.name}
                                            </span>{" "}
                                            removed.
                                          </p>
                                        ),
                                        error: (
                                          <p>
                                            <span className="font-bold">
                                              {recipe.name}
                                            </span>{" "}
                                            could not be removed
                                          </p>
                                        ),
                                      }
                                    );
                                  } catch {}
                                }}
                              />
                              <FcCheckmark
                                className="h-10 w-10"
                                title="Recipe Saved!"
                              />
                            </div>
                          )}
                      </>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="self-center">
              <p className="custom-p">
                You do not have any bookmarks at the moment.
              </p>
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
      await ssg.user.getUserRecipeIds.prefetch({ userId: user.id });
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
