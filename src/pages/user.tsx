import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import Menu from "src/components/menu";
import { trpc } from "src/utils/trpc";
import { ssrInit } from "src/utils/ssg";
import Spinner from "src/components/spinner";
import Error from "src/components/error";
import toast, { Toaster } from "react-hot-toast";

const User = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const {
    data: userData,
    isError,
    isLoading,
  } = trpc.user.getUserByEmail.useQuery({
    email,
  });

  const deleteUser = trpc.user.deleteUser.useMutation({
    onSuccess: async () => {
      await router.push("/");
    },
  });

  const onDeleteUser = async (id: string) => {
    try {
      await toast.promise(deleteUser.mutateAsync({ id }), {
        loading: <p>Deleting your account...</p>,
        success: <p>Your account has been deleted</p>,
        error: <p>Your account could not be deleted</p>,
      });
    } catch {}
  };

  return (
    <Menu user={userData}>
      <Head>
        <title>User</title>
      </Head>
      <div>
        <Toaster />
      </div>
      {isLoading && <Spinner text="User Information Loading..." />}
      {isError && <Error />}
      {userData && (
        <div className="flex flex-col gap-4">
          <h2 className="text-center text-3xl font-bold">
            {userData.name}
            {`'`}s Profile
          </h2>
          <div className="mx-auto flex w-96 flex-col items-center rounded bg-black bg-opacity-25 p-2">
            <p className="custom-par font-bold">Email:</p>
            <p className="text-lg">{userData.email}</p>
            <p className="custom-par font-bold">Name:</p>
            <p className="text-lg">{userData.name}</p>
            <button
              className="custom-button"
              onClick={() => onDeleteUser(userData.id)}
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </Menu>
  );
};

export default User;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { ssg, session } = await ssrInit(context);

  const email = session?.user?.email as string;

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
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
