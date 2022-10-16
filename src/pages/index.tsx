import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

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
      <main className="container mx-auto flex flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-4xl font-bold">Receta</h1>
        <p className="text-lg text-stone-700">
          Food is a topic of universal interest irrespective of cultures,
          countries, and generations. The advent of the internet has only
          increased this interest, for users are constantly looking out for new
          recipes, ingredients, food photos, and other food-related information
          online
        </p>
      </main>
    </>
  );
};

export default Home;
