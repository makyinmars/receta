import type { NextPage } from "next";
import Head from "next/head";

import { trpc } from "src/utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading, isError } = trpc.recipe.getLastTwoRecipes.useQuery();

  return (
    <>
      <Head>
        <title>Receta</title>
        <meta
          name="description"
          content="Improve your cooking skills with Receta"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="self-center text-3xl font-bold">Receta is Here!</h2>
          <p className="text-lg text-stone-700">
            Food is a topic of universal interest irrespective of cultures,
            countries, and generations. The advent of the internet has only
            increased this interest, for users are constantly looking out for
            new recipes, ingredients, food photos, and other food-related
            information online
          </p>
          <div className="flex justify-center">
            <button className="rounded border border-gray-400 bg-gray-100 p-2 shadow-md">
              View All Recipes
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <h2 className="col-span-2 text-center text-3xl font-bold">
            Latest Recipes
          </h2>
          {data &&
            data.map((recipe, i) => (
              <div key={i} className="flex flex-col gap-4">
                <img
                  src={recipe.thumbnailUrl}
                  alt={recipe.name}
                  className="rounded"
                />
                <h2 className="text-lg font-bold">{recipe.name}</h2>
                <p className="text-lg text-stone-700">{recipe.description}</p>
              </div>
            ))}
        </div>
      </main>
    </>
  );
};

export default Home;
