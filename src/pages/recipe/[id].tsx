import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { Toaster, toast } from "react-hot-toast";
import { BsFillBookmarksFill, BsBookmarks } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";

import { ssrInit } from "src/utils/ssg";
import { trpc } from "src/utils/trpc";
import { ingredients } from "src/data/ingredients";
import Spinner from "src/components/spinner";
import Error from "src/components/error";
import Menu from "src/components/menu";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { useState } from "react";

const RecipeId = ({
  id,
  email,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [userVoted, setUserVoted] = useState(false);
  const [positiveRating, setPositiveRating] = useState(false);
  const [negativeRating, setNegativeRating] = useState(false);

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

  const createBookmark = trpc.bookmark.createBookmark.useMutation({
    onSuccess: async () => {
      await utils.user.getUserByEmail.invalidate({ email });
      await utils.recipe.getRecipeById.invalidate({ id });
      await utils.user.getUserRecipeIds.invalidate({ userId });
    },
  });

  const removeBookmark = trpc.bookmark.deleteBookmark.useMutation({
    onSuccess: async () => {
      await utils.user.getUserByEmail.invalidate({ email });
      await utils.recipe.getRecipeById.invalidate({ id });
      await utils.user.getUserRecipeIds.invalidate({ userId });
      toast.success(<p className="text-lg">Thank you for your vote!</p>);
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

  return (
    <Menu user={userData}>
      {isLoading && <Spinner text="Recipe Loading" />}
      {isError && <Error />}
      <div>
        <Toaster />
      </div>
      {data && (
        <div className="flex flex-col gap-4">
          <Head>
            <title>{data.name}</title>
          </Head>
          <h1 className="text-center text-3xl font-bold">{data.name}</h1>
          <div className="flex items-center gap-4">
            <h2 className="custom-subtitle">Description</h2>
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
                                  <span className="font-bold">{data.name}</span>{" "}
                                  from your Bookmarks...`
                                </p>
                              ),
                              success: (
                                <p>
                                  <span className="font-bold">{data.name}</span>{" "}
                                  removed.
                                </p>
                              ),
                              error: (
                                <p>
                                  <span className="font-bold">{data.name}</span>{" "}
                                  could not be removed
                                </p>
                              ),
                            }
                          );
                        } catch {}
                      }}
                    />
                    <FcCheckmark className="h-10 w-10" title="Recipe Saved!" />
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
          </div>
          <hr className="border border-stone-700" />
          <div className="grid grid-cols-1 gap-4">
            <p className="w-full self-center text-lg text-stone-700">
              {data.description === ""
                ? "No description. We will add it soon. In the meantime, you can bookmark this recipe and come back later. Thank you for your patience."
                : data.description.substring(0, 110).concat("...")}
            </p>
            <div className="col-span-2 flex flex-col justify-between gap-4 sm:flex-row">
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
          </div>
          <h2 className="custom-subtitle">Ingredients</h2>
          <hr className="border border-stone-700" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {ingredients.map((ingredient, i) => (
              <div key={i}>
                <p className="custom-par">
                  <span className="font-semibold">{i + 1}.</span> {ingredient}
                </p>
              </div>
            ))}
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
            <div
              key={i}
              className="flex flex-col justify-between gap-4 sm:flex-row"
            >
              <p className="custom-par">
                <span className="font-semibold">Positive Rating:</span>{" "}
                {positiveRating
                  ? rating.countPositive + 1
                  : rating.countPositive}
              </p>
              <p className="custom-par">
                <span className="font-semibold">Negative Rating:</span>{" "}
                {negativeRating
                  ? rating.countNegative + 1
                  : rating.countNegative}
              </p>
              <p className="custom-par">
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
