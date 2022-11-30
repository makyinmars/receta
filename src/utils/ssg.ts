import { GetServerSidePropsContext } from "next";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { createContextInner } from "src/server/trpc/context";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { appRouter } from "src/server/trpc/router/_app";

/**
 * Initialize server-side rendering tRPC helpers.
 * Provides a method to prefetch tRPC-queries in a `getServerSideProps`-function.
 * Make sure to `return { props: { trpcState: ssr.dehydrate() } }` at the end.
 */
export const ssrInit = async (context: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(context);

  const ctx = await createContextInner({ session });

  const ssg = createProxySSGHelpers({
    ctx,
    router: appRouter,
    transformer: superjson,
  });

  return {
    ssg,
    session,
  };
};
