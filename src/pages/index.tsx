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
      <main className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-around">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold text-center">
                Improve Your Skills with Receta
              </h1>
              <p className="text-xl text-stone-600 rounded bg-violet-300 bg-opacity-50 p-2 text-center">
                A great site that will help you improve your cooking skills with
                great recipes.
              </p>
              <div>
                <div className="flex justify-center">
                  <button className="custom-button text-xl">Get Started</button>
                </div>
              </div>
            </div>
            <img
              src="/images/cook.jpeg"
              className="h-80 w-80 self-center rounded"
              alt="Cook Image"
            />
          </div>
          <h2 className="self-center text-4xl font-bold">Receta is Here!</h2>
          <p className="rounded bg-violet-300 bg-opacity-50 p-2 text-2xl text-stone-700">
            Welcome to our recipe site! We are dedicated to providing delicious
            and easy-to-follow recipes for everyone. Our site features a wide
            variety of dishes, from hearty main courses to mouthwatering
            desserts. No matter your skill level in the kitchen, you will be
            able to find something to cook up that will impress your friends and
            family. Our recipe collection is constantly growing, so be sure to
            check back often to see what{`'`}s new. You can also sign up for our
            newsletter to receive updates and special offers. Happy cooking!
          </p>
          <div className="flex justify-center">
            <button
              className="custom-button text-xl"
              onClick={() => router.push("/recipes")}
            >
              View All Recipes
            </button>
          </div>
        </div>
        <h2 className="text-center text-4xl font-bold">Latest Recipes</h2>
        {isLoading && <Spinner text="Latest Recipes Loading" />}
        {isError && <Error />}
        {data && <Recipe data={data} />}
        <h2 className="text-center text-4xl font-bold">
          Bookmark Your Favorite Recipes
        </h2>
        <div className="grid grid-cols-1 place-items-center content-center gap-4 md:grid-cols-2">
          <ul className="flex flex-col gap-4">
            <li className="rounded bg-violet-300 bg-opacity-50 p-2 text-center text-2xl text-stone-700">
              One of the standout features of our recipe site is the bookmark
              function. This allows you to save any recipe that catches your
              eye, so you can easily access it later. Whether you{`'`}re
              planning a special dinner or just want to save a recipe for future
              reference, the bookmark function is a great way to keep track of
              all your favorite dishes.
            </li>
            <li className="rounded bg-violet-300 bg-opacity-50 p-2 text-center text-2xl text-stone-700">
              To use the bookmark function, simply click the{" "}
              <span className="font-semibold">
                {`"`}Bookmark{`"`}
              </span>{" "}
              button on any recipe page. This will add the recipe to your
              personal collection, which you can access at any time by clicking
              on the{" "}
              <span className="font-semibold">
                {`"`}Bookmarks{`"`}{" "}
              </span>{" "}
              tab in the top menu. From here, you can view all your saved
              recipes, organize them into categories, and even print them out
              for easy reference in the kitchen. So why wait? Start bookmarking
              your favorite recipes today!
            </li>
          </ul>
          <div>
            <img
              src="https://media2.giphy.com/media/l0MYyKbTCresSjrhK/giphy.gif?cid=ecf05e47m2f6n4ygqzk1odmxpej6lhnv5r6soz3o8onlr5fq&rid=giphy.gif&ct=g"
              className="rounded h-96"
              alt="Images in rotation"
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
