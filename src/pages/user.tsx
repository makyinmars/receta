import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import Menu from "src/components/menu";
import { trpc } from "src/utils/trpc";
import { ssrInit } from "src/utils/ssg";
import Spinner from "src/components/spinner";
import Error from "src/components/error";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      {userData && (
        <div className="flex flex-col gap-4">
          <h2 className="custom-h2 text-center">
            {userData.name}
            {`'`}s Profile{" "}
          </h2>
          <Card>
            <CardHeader>
              <CardDescription>
                Here you can see your user information and delete your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
              <p className="custom-p">{userData.email}</p>
              <p className="custom-p">{userData.name}</p>
              <Button onClick={() => onDeleteUser(userData.id)}>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      {isLoading && <Spinner text="User Information Loading..." />}
      {isError && <Error />}
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
