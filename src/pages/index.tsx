import Spinner from "@/components/spinner";
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
      <main className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="self-center text-3xl font-bold">Receta is Here!</h2>
          <p className="text-lg font-semibold text-stone-700">
            Food is a topic of universal interest irrespective of cultures,
            countries, and generations. The advent of the internet has only
            increased this interest, for users are constantly looking out for
            new recipes, ingredients, food photos, and other food-related
            information online
          </p>
          <div className="flex justify-center">
            <button className="custom-button">View All Recipes</button>
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold">Latest Recipes</h2>
        {isLoading && <Spinner text="Latest Recipes Loading" />}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data &&
            data.map((recipe, i) => (
              <div
                key={i}
                className="custom-border group flex h-80 flex-col items-center justify-between gap-4 rounded p-4 md:h-auto"
              >
                <p className="hidden text-lg font-semibold text-stone-700 group-hover:flex">
                  {recipe.description}
                </p>
                <img
                  src={recipe.thumbnailUrl}
                  alt={recipe.name}
                  className="h-40 w-40 self-center rounded group-hover:hidden md:h-80 md:w-80"
                />
                <div>
                  <h2 className="text-lg font-bold">{recipe.name}</h2>
                  <div className="flex justify-center">
                    <button className="custom-button">View Recipe</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <h2 className="text-center text-3xl font-bold">
          Bookmark Your Favorite Recipes
        </h2>
      </main>
    </>
  );
};

export default Home;
