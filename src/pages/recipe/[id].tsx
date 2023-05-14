import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { Toaster, toast } from "react-hot-toast";
import { BsFillBookmarksFill, BsBookmarks } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";
import { useForm, SubmitHandler } from "react-hook-form";

import { ssrInit } from "src/utils/ssg";
import { trpc } from "src/utils/trpc";
import { ingredients } from "src/data/ingredients";
import Spinner from "src/components/spinner";
import Error from "src/components/error";
import Menu from "src/components/menu";
import { FaDiscord, FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CommentInput = {
  recipeId: string;
  userId: string;
  text: string;
};

const RecipeId = ({
  id,
  email,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [userVoted, setUserVoted] = useState(false);
  const [positiveRating, setPositiveRating] = useState(false);
  const [negativeRating, setNegativeRating] = useState(false);

  const { register, handleSubmit, reset } = useForm<CommentInput>({
    defaultValues: {
      recipeId: id,
      userId: userId ?? "",
      text: "",
    },
  });

  const utils = trpc.useContext();

  const { data: userData } = trpc.user.getUserByEmail.useQuery({
    email,
  });

  const { data, isLoading, isError } = trpc.recipe.getRecipeById.useQuery({
    id,
  });

  const { data: userRecipeIdsData } = trpc.user.getUserRecipeIds.useQuery({
    userId,
  });

  const {
    data: commentsData,
    isLoading: commentsIsLoading,
    isError: commentsIsError,
  } = trpc.comment.getCommentsByRecipeId.useQuery(id);

  const createBookmark = trpc.bookmark.createBookmark.useMutation({
    onSuccess: async () => {
      await utils.user.getUserByEmail.invalidate({ email });
      await utils.recipe.getRecipeById.invalidate({ id });
      await utils.user.getUserRecipeIds.invalidate({ userId });
      await utils.bookmark.getBookmarks.invalidate({ userId });
    },
  });

  const removeBookmark = trpc.bookmark.deleteBookmark.useMutation({
    onSuccess: async () => {
      await utils.user.getUserByEmail.invalidate({ email });
      await utils.recipe.getRecipeById.invalidate({ id });
      await utils.user.getUserRecipeIds.invalidate({ userId });
      await utils.bookmark.getBookmarks.invalidate({ userId });
    },
  });

  const createComment = trpc.comment.createComment.useMutation({
    onSuccess: async () => {
      await utils.comment.getCommentsByRecipeId.invalidate(id);
      reset();
    },
  });

  const deleteComment = trpc.comment.deleteComment.useMutation({
    onSuccess: async () => {
      await utils.comment.getCommentsByRecipeId.invalidate(id);
    },
  });

  const onPositiveClick = async () => {
    setPositiveRating(true);
    setUserVoted(true);
    toast.success(<p className="text-lg">Thank you for your vote!</p>);
  };

  const onNegativeClick = async () => {
    setNegativeRating(true);
    setUserVoted(true);
    toast.success(<p className="text-lg">Thank you for your vote!</p>);
  };

  const onCreateComment: SubmitHandler<CommentInput> = async (data) => {
    try {
      await toast.promise(
        createComment.mutateAsync({
          recipeId: data.recipeId,
          userId: data.userId,
          text: data.text,
        }),
        {
          loading: <p>Creating Comment...</p>,
          success: <p>Comment Created!</p>,
          error: <p>Comment Creation Failed!</p>,
        }
      );
    } catch {}
  };

  const onDeleteComment = async (id: string) => {
    try {
      await toast.promise(deleteComment.mutateAsync({ id }), {
        loading: <p>Deleting Comment...</p>,
        success: <p>Comment Deleted!</p>,
        error: <p>Comment Deletion Failed!</p>,
      });
    } catch {}
  };

  return (
    <Menu user={userData}>
      {isLoading && <Spinner text="Recipe Loading" />}
      {isError && <Error />}
      <div>
        <Toaster />
      </div>
      <div className="flex flex-col gap-4">
        {data && (
          <div className="flex flex-col gap-4">
            <Head>
              <title>{data.name}</title>
            </Head>
            <h2 className="custom-h2 flex items-center justify-center gap-4">
              {data.name}
              {userData && (
                <>
                  {userRecipeIdsData && userRecipeIdsData.includes(id) ? (
                    <div className="flex items-center gap-2">
                      <BsFillBookmarksFill
                        className="h-8 w-8 hover:cursor-pointer"
                        title="Remove From My Bookmarks"
                        onClick={async () => {
                          try {
                            await toast.promise(
                              removeBookmark.mutateAsync({
                                recipeId: id,
                              }),
                              {
                                loading: (
                                  <p>
                                    Removing{" "}
                                    <span className="font-bold">
                                      {data.name}
                                    </span>{" "}
                                    from your Bookmarks...`
                                  </p>
                                ),
                                success: (
                                  <p>
                                    <span className="font-bold">
                                      {data.name}
                                    </span>{" "}
                                    removed.
                                  </p>
                                ),
                                error: (
                                  <p>
                                    <span className="font-bold">
                                      {data.name}
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
                  ) : (
                    <BsBookmarks
                      className="h-8 w-8 hover:cursor-pointer"
                      title="Add To My Bookmarks"
                      onClick={async () => {
                        try {
                          await toast.promise(
                            createBookmark.mutateAsync({
                              recipeId: id,
                              userId: userData.id,
                            }),
                            {
                              loading: (
                                <p>
                                  Saving{" "}
                                  <span className="font-bold">{data.name}</span>{" "}
                                  in your Bookmarks...`
                                </p>
                              ),
                              success: (
                                <p>
                                  <span className="font-bold">{data.name}</span>{" "}
                                  saved.
                                </p>
                              ),
                              error: (
                                <p>
                                  <span className="font-bold">{data.name}</span>{" "}
                                  could not be saved
                                </p>
                              ),
                            }
                          );
                        } catch {}
                      }}
                    />
                  )}
                </>
              )}
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>
                  {data.description === ""
                    ? "No description. We will add it soon. In the meantime, you can bookmark this recipe and come back later. Thank you for your patience."
                    : data.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                <div className="col-span-2 flex flex-col justify-between gap-4 sm:flex-row">
                  <p className="custom-par">
                    <span className="font-semibold">Country:</span>{" "}
                    {data.country}
                  </p>
                  <p className="custom-par">
                    <span className="font-semibold">Cook Time:</span>{" "}
                    {data.cookTimeMinutes}
                  </p>
                  <p className="custom-par">
                    <span className="font-semibold">Prep Time:</span>{" "}
                    {data.prepTimeMinutes}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-around gap-2 md:flex-row">
                  <img
                    src={data.thumbnailUrl}
                    alt={data.name}
                    className="h-80 w-96 rounded"
                  />
                  {data.originalVideoUrl ? (
                    <video controls className="h-80 w-96 self-center rounded">
                      <source src={data.originalVideoUrl} type="video/mp4" />
                      <source src={data.originalVideoUrl} type="video/ogg" />
                    </video>
                  ) : (
                    "No Video"
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {ingredients.map((ingredient, i) => (
                  <div key={i}>
                    <p className="custom-par">
                      <span className="font-semibold">{i + 1}.</span>{" "}
                      {ingredient}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                {data.instructions.map((instruction, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <p className="custom-p">
                      <span className="font-semibold">Step {i + 1}:</span>{" "}
                      {instruction.displayText}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                {data.userRatings.map((rating, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-4 sm:flex-row"
                  >
                    <p className="custom-p">
                      <span className="font-semibold">Positive Rating:</span>{" "}
                      {positiveRating
                        ? rating.countPositive + 1
                        : rating.countPositive}
                    </p>
                    <p className="custom-p">
                      <span className="font-semibold">Negative Rating:</span>{" "}
                      {negativeRating
                        ? rating.countNegative + 1
                        : rating.countNegative}
                    </p>
                    <p className="custom-p">
                      <span className="font-semibold">Overall Rating:</span>{" "}
                      {(positiveRating
                        ? rating.score * 100 + 1
                        : negativeRating
                        ? rating.score * 100 - 1
                        : rating.score * 100
                      ).toFixed(0)}{" "}
                      %
                    </p>
                  </div>
                ))}
                <div className="flex justify-around">
                  {positiveRating ? (
                    <FaRegThumbsUp
                      className="h-16 w-16 text-green-600 hover:cursor-pointer active:text-green-700"
                      onClick={() => onPositiveClick()}
                    />
                  ) : negativeRating ? (
                    <FaRegThumbsDown
                      className="h-16 w-16 text-red-600 hover:cursor-pointer active:text-red-700"
                      onClick={() => onNegativeClick()}
                    />
                  ) : (
                    <>
                      <FaRegThumbsUp
                        className="h-16 w-16 text-green-600 hover:cursor-pointer active:text-green-700"
                        onClick={() => onPositiveClick()}
                      />
                      <FaRegThumbsDown
                        className="h-16 w-16 text-red-600 hover:cursor-pointer active:text-red-700"
                        onClick={() => onNegativeClick()}
                      />
                    </>
                  )}
                </div>
                {userVoted && (
                  <h2 className="text-center text-lg font-semibold">
                    You Already Voted. Thank You!
                  </h2>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {commentsIsLoading && <Spinner text="Comments Loading..." />}
            {commentsIsError && <Error />}

            {commentsData && commentsData.length > 0 ? (
              commentsData.map((comment, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="font-semibold">By User:</span>{" "}
                      {comment && comment.user?.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="font-semibold">Create on: </span>{" "}
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <p className="custom-p">{comment.text}</p>
                    {comment.userId === userId && (
                      <Button onClick={() => onDeleteComment(comment.id)}>
                        Delete My Comment
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="custom-p">No Comments Yet</p>
            )}
            {userId ? (
              <form
                onSubmit={handleSubmit(onCreateComment)}
                className="flex flex-col justify-center gap-4"
              >
                <Textarea rows={4} {...register("text")} />
                <Button type="submit" className="w-full">
                  Add Comment
                </Button>
              </form>
            ) : (
              <div className="flex flex-col justify-center gap-2">
                <p className="custom-p text-center">
                  You Must Be Logged In To Comment
                </p>

                <Button
                  onClick={() =>
                    signIn("discord", {
                      callbackUrl: `/user`,
                    })
                  }
                >
                  Sign In
                  <FaDiscord className="h-8 w-8 text-purple-600" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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

  await ssg.comment.getCommentsByRecipeId.prefetch(id);

  if (email) {
    const user = await ssg.user.getUserByEmail.fetch({ email });
    if (user) {
      await ssg.user.getUserRecipeIds.prefetch({ userId: user.id });

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
