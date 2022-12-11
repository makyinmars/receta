import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = router({
  getUserByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().nullable(),
      })
    )
    .query(({ ctx, input: { email } }) => {
      if (email) {
        return ctx.prisma.user.findUnique({
          where: {
            email,
          },
        });
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this resource",
        });
      }
    }),
  deleteUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input: { id } }) => {
      return ctx.prisma.user.delete({
        where: {
          id,
        },
      });
    }),
  getUserRecipeIds: protectedProcedure
    .input(
      z.object({
        userId: z.string().nullable(),
      })
    )
    .query(async ({ ctx, input: { userId } }) => {
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this resource",
        });
      }
      const recipesIds = (await ctx.prisma.bookmark.findMany({
        where: {
          userId,
        },
        select: {
          recipeId: true,
        },
      })) as { recipeId: string }[];

      if (!recipesIds.length) {
        return [];
      } else {
        return recipesIds.map((recipe) => recipe.recipeId);
      }
    }),
});
