import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const bookmarkRouter = router({
  createBookmark: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { recipeId, userId } }) => {
      const bookmark = await ctx.prisma.bookmark.findFirst({
        where: {
          recipeId,
        },
      });

      if (bookmark) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bookmark already exists",
        });
      }

      return await ctx.prisma.bookmark.create({
        data: {
          recipeId,
          userId,
        },
      });
    }),

  getBookmarks: protectedProcedure
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

      const recipesIds = await ctx.prisma.bookmark.findMany({
        where: {
          userId,
        },
        select: {
          recipeId: true,
        },
      });

      if (!recipesIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No bookmarks found",
        });
      } else {
        // Get the recipes from the ids
        const recipes = await ctx.prisma.recipe.findMany({
          where: {
            id: {
              in: recipesIds.map((recipe) => recipe.recipeId) as string[],
            },
          },
          select: {
            id: true,
            name: true,
            description: true,
            thumbnailUrl: true,
          },
        });
        return recipes;
      }
    }),

  deleteBookmark: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
      })
    )
    .mutation(({ ctx, input: { recipeId } }) => {
      return ctx.prisma.bookmark.deleteMany({
        where: {
          recipeId,
        },
      });
    }),
});
