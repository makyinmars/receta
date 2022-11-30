import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import { trpc } from "src/utils/trpc";
import { ssrInit } from "src/utils/ssg";
import Spinner from "src/components/spinner";
import Recipe from "src/components/recipe";
import Error from "src/components/error";

const Recipes = () => {
  const { data, isLoading, isError } = trpc.recipe.getAllRecipes.useQuery();

  return (
    <div className="flex flex-col gap-4">
      <Head>
        <title>Recipes</title>
      </Head>
      <h1 className="text-center text-3xl font-bold">Recipes</h1>
      {isLoading && <Spinner text="Loading Recipes" />}
      {isError && <Error />}
      {data && <Recipe data={data} />}
    </div>
  );
};

export default Recipes;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg } = await ssrInit(context);

  await ssg.recipe.getAllRecipes.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
