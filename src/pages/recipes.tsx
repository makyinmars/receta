import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useCallback, useEffect, useState } from "react";
import Head from "next/head";

import { trpc } from "src/utils/trpc";
import { ssrInit } from "src/utils/ssg";
import Menu from "src/components/menu";
import Spinner from "src/components/spinner";
import Recipe from "src/components/recipe";
import Error from "src/components/error";
import { Input } from "@/components/ui/input";

const Recipes = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: userData } = trpc.user.getUserByEmail.useQuery({ email });
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
    <Menu user={userData}>
      <div className="flex flex-col gap-4">
        <Head>
          <title>Recipes</title>
        </Head>
        <h2 className="custom-h2 text-center">Recipes</h2>
        <div className="flex justify-center gap-2 pb-4">
          <Input
            type="text"
            placeholder="Type to find a recipe"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        {isLoading && <Spinner text="Loading Recipes" />}
        {isError && <Error />}
        {recipesData && <Recipe data={recipesData} />}
        {recipesData && recipesData.length === 0 && (
          <h2 className="text-center text-xl font-bold text-red-500">
            We could not find a recipe, try a new one.
          </h2>
        )}
      </div>
    </Menu>
  );
};

export default Recipes;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  await ssg.recipe.getAllRecipes.prefetch();

  if (email) {
    await ssg.user.getUserByEmail.prefetch({ email });
    return {
      props: {
        trpcState: ssg.dehydrate(),
        email,
      },
    };
  } else {
    return {
      props: {
        trpcState: ssg.dehydrate(),
        email: null,
      },
    };
  }
};
