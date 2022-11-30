import { Recipe } from "@prisma/client";
import { z } from "zod";

import { spicy as desserts } from "src/data/spicy";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const recipeRouter = router({
  createRecipes: publicProcedure.mutation(async ({ ctx }) => {
    // Create a Promise All to wait for all the recipes to be created
    const promise = new Promise((resolve, reject) => {
      desserts.map(async (dessert) => {
        const recipe = await ctx.prisma.recipe.create({
          data: {
            createdAt: new Date(),
            updatedAt: new Date(),
            name: dessert.name,
            country: dessert.country,
            cookTimeMinutes: dessert.cookTimeMinutes,
            description: dessert.description,
            instructions: {
              createMany: {
                data: dessert.instructions.map((instruction) => ({
                  startTime: instruction.startTime,
                  appliance: instruction.appliance,
                  endTime: instruction.endTime,
                  temperature: instruction.temperature,
                  displayText: instruction.displayText,
                  position: instruction.position,
                })),
              },
            },
            tags: {
              createMany: {
                data: dessert.tags.map((tag) => ({
                  name: tag.name,
                  type: tag.type,
                  displayName: tag.displayName,
                })),
              },
            },
            topics: {
              createMany: {
                data: dessert.topics.map((topic) => ({
                  name: topic.name,
                  slug: topic.slug,
                })),
              },
            },
            originalVideoUrl: dessert.originalVideoUrl,
            prepTimeMinutes: dessert.prepTimeMinutes,
            thumbnailUrl: dessert.thumbnailUrl,
            userRatings: {
              createMany: {
                data: dessert.userRatings.map((userRating) => ({
                  countNegative: userRating.countNegative,
                  countPositive: userRating.countPositive,
                  score: userRating.score,
                })),
              },
            },
          },
        });

        return recipe;
      });

      resolve("Recipes created");
    });

    await Promise.all([promise]).then((values) => {
      console.log("Promise All", values);
      return values;
    });
  }),

  addInstructions: publicProcedure.mutation(async ({ ctx }) => {
    // Get all the recipes with the ids
    const recipes = await ctx.prisma.recipe.findMany({});

    // Create a Promise All to wait for all the recipes to be created
    const promise = new Promise((resolve, reject) => {
      desserts.map(async (dessert, i) => {
        const recipe = (await ctx.prisma.recipe.findUnique({
          where: {
            id: recipes[i]?.id,
          },
        })) as Recipe;

        // dessert.instructions.map(async (instruction) => {
        //   const ingredientCreated = await ctx.prisma.instruction.create({
        //     data: {
        //       startTime: instruction.startTime,
        //       appliance: instruction.appliance,
        //       endTime: instruction.endTime,
        //       temperature: instruction.temperature,
        //       position: instruction.position,
        //       displayText: instruction.displayText,
        //       recipe: {
        //         connect: {
        //           id: recipe.id,
        //         },
        //       },
        //     },
        //   });

        //   return ingredientCreated;
        // });

        // dessert.tags.map(async (tag) => {
        //   const tagCreated = await ctx.prisma.tag.create({
        //     data: {
        //       type: tag.type,
        //       name: tag.name,
        //       displayName: tag.displayName,
        //       recipe: {
        //         connect: {
        //           id: recipe.id,
        //         },
        //       },
        //     },
        //   });

        //   return tagCreated;
        // });

        // dessert.topics.map(async (topic) => {
        //   const topicCreated = await ctx.prisma.topic.create({
        //     data: {
        //       name: topic.name,
        //       slug: topic.slug,
        //       recipe: {
        //         connect: {
        //           id: recipe.id,
        //         },
        //       },
        //     },
        //   });

        //   return topicCreated;
        // });

        // dessert.tags.map(async (tag) => {
        //   const tagCreated = await ctx.prisma.tag.create({
        //     data: {
        //       type: tag.type,
        //       name: tag.name,
        //       displayName: tag.displayName,
        //       recipe: {
        //         connect: {
        //           id: recipe.id,
        //         },
        //       },
        //     },
        //   });

        //   return tagCreated;
        // });

        dessert.userRatings.map(async (userRating) => {
          const userRatingCreated = await ctx.prisma.userRating.create({
            data: {
              countNegative: userRating.countNegative,
              countPositive: userRating.countPositive,
              score: userRating.score,
              recipe: {
                connect: {
                  id: recipe.id,
                },
              },
            },
          });

          return userRatingCreated;
        });
      });

      resolve("Ingredients created");
    });

    await Promise.all([promise]).then((values) => {
      console.log("Promise All", values);
      return values;
    });
  }),

  getLastFourRecipes: publicProcedure.query(({ ctx }) => {
    const recipes = ctx.prisma.recipe.findMany({
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnailUrl: true,
      },
    });
    return recipes;
  }),

  getAllRecipes: publicProcedure.query(({ ctx }) => {
    const recipes = ctx.prisma.recipe.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnailUrl: true,
      },
    });
    return recipes;
  }),

  getRecipeById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input: { id } }) => {
      const recipe = ctx.prisma.recipe.findUnique({
        where: {
          id,
        },
        include: {
          instructions: true,
          tags: true,
          topics: true,
          userRatings: true,
        },
      });
      return recipe;
    }),
});
