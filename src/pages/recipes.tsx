import { GetServerSidePropsContext } from "next";
import { useCallback, useEffect, useState } from "react";
import Head from "next/head";

import { trpc } from "src/utils/trpc";
import { ssrInit } from "src/utils/ssg";
import Spinner from "src/components/spinner";
import Recipe from "src/components/recipe";
import Error from "src/components/error";

const Recipes = () => {
  const { data, isLoading, isError } = trpc.recipe.getAllRecipes.useQuery();
  const [search, setSearch] = useState("");
  const [recipesData, setRecipesData] = useState(data);

  const findRecipes = () => {
    return (
      data &&
      data.filter((recipe) => {
        return recipe.name.toLowerCase().includes(search.toLowerCase());
      })
    );
  };

  const findRecipesCallback = useCallback(findRecipes, [search, data]);

  useEffect(() => {
    setRecipesData(findRecipesCallback());
  }, [findRecipesCallback]);

  return (
    <div className="flex flex-col gap-4">
      <Head>
        <title>Recipes</title>
      </Head>
      <h1 className="text-center text-3xl font-bold">Recipes</h1>
      <div className="flex justify-center gap-2 pb-4">
        <input
          type="text"
          className="custom-border rounded bg-white bg-opacity-40 p-2"
          placeholder="Type to find a recipe"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      {isLoading && <Spinner text="Loading Recipes" />}
      {isError && <Error />}
      {recipesData && <Recipe data={recipesData} />}
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
