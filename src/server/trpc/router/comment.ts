import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const commentRouter = router({
  createComment: protectedProcedure
    .input(
      z.object({
        recipeId: z.string(),
        userId: z.string(),
        text: z.string(),
      })
    )
    .mutation(({ ctx, input: { recipeId, userId, text } }) => {
      const comment = ctx.prisma.comment.create({
        data: {
          recipeId,
          userId,
          text,
        },
      });
      return comment;
    }),

  getCommentsByRecipeId: publicProcedure
    .input(z.string())
    .query(({ ctx, input: recipeId }) => {
      const comments = ctx.prisma.comment.findMany({
        where: {
          recipeId,
        },
        include: {
          user: true,
        },
      });
      return comments;
    }),

  getCommentsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input: { userId } }) => {
      const comments = ctx.prisma.comment.findMany({
        where: {
          userId,
        },
        include: {
          user: true,
        },
      });
      return comments;
    }),

  deleteComment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input: { id } }) => {
      const comment = ctx.prisma.comment.delete({
        where: {
          id,
        },
      });
      return comment;
    }),
});
