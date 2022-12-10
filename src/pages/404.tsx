import Head from "next/head";

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Head>
        <title>Page Not Found - 404</title>
      </Head>
      <h1 className="text-4xl font-bold">Page Not Found - 404</h1>
    </div>
  );
};

export default NotFound;
