import { ssrInit } from "@/utils/ssg";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Menu from "src/components/menu";
import { trpc } from "src/utils/trpc";

const User = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: userData } = trpc.user.getUserByEmail.useQuery({
    email,
  });

  return <Menu user={userData}>User</Menu>;
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
        destinatin: "/",
        permanent: false,
      },
    };
  }
};
