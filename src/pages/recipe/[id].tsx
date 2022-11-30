import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

import { ssrInit } from "src/utils/ssg";
import { trpc } from "src/utils/trpc";
import Spinner from "src/components/spinner";
import Error from "src/components/error";

const RecipeId = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, isLoading, isError } = trpc.recipe.getRecipeById.useQuery({
    id,
  });

  return (
    <div>
      {isLoading && <Spinner text="Recipe Loading" />}
      {isError && <Error />}
      {data && (
        <div className="flex flex-col gap-4">
          <Head>
            <title>{data.name}</title>
          </Head>
          <h1 className="text-center text-3xl font-bold">{data.name}</h1>
          <h2 className="custom-subtitle">Description</h2>
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
    </div>
  );
};

export default RecipeId;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const { ssg } = await ssrInit(context);

  const id = context.params?.id as string;

  await ssg.recipe.getRecipeById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};
