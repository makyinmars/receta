import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { trpc } from "src/utils/trpc";
import Error from "src/components/error";
import Recipe from "src/components/recipe";
import Spinner from "src/components/spinner";
import { ssrInit } from "src/utils/ssg";

const Home: NextPage = () => {
  const router = useRouter();
  const { data, isLoading, isError } =
    trpc.recipe.getLastFourRecipes.useQuery();

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
            <button
              className="custom-button"
              onClick={() => router.push("/recipes")}
            >
              View All Recipes
            </button>
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold">Latest Recipes</h2>
        {isLoading && <Spinner text="Latest Recipes Loading" />}
        {isError && <Error />}
        {data && <Recipe data={data} />}
        <h2 className="text-center text-3xl font-bold">
          Bookmark Your Favorite Recipes
        </h2>
        <div className="grid grid-cols-1 place-items-center content-center gap-4 md:grid-cols-2">
          <div>
            <p className="text-center text-lg font-semibold">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa
              quis perferendis libero doloremque ratione! Cupiditate laborum
              quibusdam aliquid quam non, adipisci blanditiis nihil, delectus,
              porro repellat nostrum suscipit temporibus nobis! Lorem, ipsum
              dolor sit amet consectetur adipisicing elit. Culpa quis
              perferendis libero doloremque ratione! Cupiditate laborum
              quibusdam aliquid quam non, adipisci blanditiis nihil, delectus,
              porro repellat nostrum suscipit temporibus nobis!
            </p>
          </div>
          <div>
            <img
              src="https://media2.giphy.com/media/l0MYyKbTCresSjrhK/giphy.gif?cid=ecf05e47m2f6n4ygqzk1odmxpej6lhnv5r6soz3o8onlr5fq&rid=giphy.gif&ct=g"
              width="480"
              height="270"
              className="rounded"
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg } = await ssrInit(context);

  await ssg.recipe.getLastFourRecipes.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
