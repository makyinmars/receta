import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";

import { trpc } from "src/utils/trpc";
import Error from "src/components/error";
import Recipe from "src/components/recipe";
import Spinner from "src/components/spinner";
import { ssrInit } from "src/utils/ssg";
import Menu from "src/components/menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data, isLoading, isError } =
    trpc.recipe.getLastFourRecipes.useQuery();

  const { data: userData } = trpc.user.getUserByEmail.useQuery({
    email,
  });

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
      <Menu user={userData}>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Receta is Here!</CardTitle>
              <CardDescription>
                Welcome to our recipe site! We are dedicated to providing
                delicious and easy-to-follow recipes for everyone. Our site
                features a wide variety of dishes, from hearty main courses to
                mouthwatering desserts. No matter your skill level in the
                kitchen, you will be able to find something to cook up that will
                impress your friends and family. Our recipe collection is
                constantly growing, so be sure to check back often to see what
                {`'`}s new. You can also sign up to bookmarks your favorite
                recipes. Happy cooking!
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => router.push("/recipes")}
              >
                View All Recipes
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Improve Your Skills with Receta</CardTitle>
              <CardDescription>
                A great site that will help you improve your cooking skills with
                great recipes. Sign In to bookmark your favorite recipes!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button
                onClick={() => router.push("/recipes")}
                className="w-full"
              >
                Get Started
              </Button>

              {userData ? (
                <Button
                  className="flex w-full items-center justify-center gap-4"
                  onClick={() => router.push("/user")}
                >
                  View Profile
                </Button>
              ) : (
                <Button
                  title="Sign in with Discord"
                  className="flex w-full items-center justify-center gap-2"
                  onClick={() =>
                    signIn("discord", {
                      callbackUrl: `/user`,
                    })
                  }
                >
                  Sign In
                  <FaDiscord className="h-8 w-8 text-purple-600" />
                </Button>
              )}
            </CardContent>
          </Card>
          <h2 className="custom-h2 text-center">Latest Recipes</h2>
          <Card>
            <CardHeader>
              <CardDescription>
                Here are the latest recipes from our site. We hope you enjoy!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {isLoading && <Spinner text="Latest Recipes Loading" />}
              {isError && <Error />}
              {data && <Recipe data={data} />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bookmark Your Favorite Recipes</CardTitle>
              <CardDescription>
                One of the standout features of our recipe site is the bookmark
                function. This allows you to save any recipe that catches your
                eye, so you can easily access it later. Whether you{`'`}re
                planning a special dinner or just want to save a recipe for
                future reference, the bookmark function is a great way to keep
                track of all your favorite dishes.
              </CardDescription>
              <CardDescription>
                To use the bookmark function, simply click the{" "}
                <span className="font-semibold">
                  {`"`}Bookmark{`"`}
                </span>{" "}
                button on any recipe page. This will add the recipe to your
                personal collection, which you can access at any time by
                clicking on the{" "}
                <span className="font-semibold">
                  {`"`}Bookmarks{`"`}{" "}
                </span>{" "}
                tab in the top menu. From here, you can view all your saved
                recipes, organize them into categories, and even print them out
                for easy reference in the kitchen. So why wait? Start
                bookmarking your favorite recipes today!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="https://media2.giphy.com/media/l0MYyKbTCresSjrhK/giphy.gif?cid=ecf05e47m2f6n4ygqzk1odmxpej6lhnv5r6soz3o8onlr5fq&rid=giphy.gif&ct=g"
                className="mx-auto h-96 rounded shadow-xl drop-shadow-xl"
                alt="Images in rotation"
              />
            </CardContent>
          </Card>
        </div>
      </Menu>
    </>
  );
};

export default Home;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

  await ssg.recipe.getLastFourRecipes.prefetch();

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
