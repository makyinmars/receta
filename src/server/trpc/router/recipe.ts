import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { desserts } from "@/data/dessert";
import { Recipe } from "@prisma/client";

export const recipeRouter = router({
  createRecipes: publicProcedure.mutation(async ({ ctx }) => {
    // Create a Promise All to wait for all the recipes to be created
    const promise = new Promise((resolve, reject) => {
      desserts.map(async (dessert) => {
        const recipe = await ctx.prisma.recipe.create({
          data: {
            name: dessert.name,
            country: dessert.country,
            cookTimeMinutes: dessert.cookTimeMinutes,
            description: dessert.description,
            // instructions: {
            //   createMany: {
            //     data: dessert.instructions.map((instruction) => ({
            //       startTime: instruction.startTime,
            //       appliance: instruction.appliance,
            //       endTime: instruction.endTime,
            //       temperature: instruction.temperature,
            //       displayText: instruction.displayText,
            //       position: instruction.position,
            //     })),
            //   },
            // },
            // tags: {
            //   createMany: {
            //     data: dessert.tags.map((tag) => ({
            //       name: tag.name,
            //       type: tag.type,
            //       displayName: tag.displayName,
            //     })),
            //   },
            // },
            // topics: {
            //   createMany: {
            //     data: dessert.topics.map((topic) => ({
            //       name: topic.name,
            //       slug: topic.slug,
            //     })),
            //   },
            // },
            originalVideoUrl: dessert.originalVideoUrl,
            prepTimeMinutes: dessert.prepTimeMinutes,
            thumbnailUrl: dessert.thumbnailUrl,
            // userRatings: {
            //   createMany: {
            //     data: dessert.userRatings.map((userRating) => ({
            //       countNegative: userRating.countNegative,
            //       countPositive: userRating.countPositive,
            //       score: userRating.score,
            //     })),
            //   },
            // },
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

  addInstructions: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id } }) => {
      // Create a Promise All to wait for all the recipes to be created
      const promise = new Promise((resolve, reject) => {
        desserts.map(async (dessert) => {
          const recipe = (await ctx.prisma.recipe.findUnique({
            where: {
              id,
            },
          })) as Recipe;

          dessert.instructions.map(async (instruction) => {
            const ingredientCreated = await ctx.prisma.instruction.create({
              data: {
                startTime: instruction.startTime,
                appliance: instruction.appliance,
                endTime: instruction.endTime,
                temperature: instruction.temperature,
                position: instruction.position,
                displayText: instruction.displayText,
                recipe: {
                  connect: {
                    id: recipe.id,
                  },
                },
              },
            });

            return ingredientCreated;
          });

          dessert.tags.map(async (tag) => {
            const tagCreated = await ctx.prisma.tag.create({
              data: {
                type: tag.type,
                name: tag.name,
                displayName: tag.displayName,
                recipe: {
                  connect: {
                    id: recipe.id,
                  },
                },
              },
            });

            return tagCreated;
          });

          dessert.topics.map(async (topic) => {
            const topicCreated = await ctx.prisma.topic.create({
              data: {
                name: topic.name,
                slug: topic.slug,
                recipe: {
                  connect: {
                    id: recipe.id,
                  },
                },
              },
            });

            return topicCreated;
          });

          dessert.tags.map(async (tag) => {
            const tagCreated = await ctx.prisma.tag.create({
              data: {
                type: tag.type,
                name: tag.name,
                displayName: tag.displayName,
                recipe: {
                  connect: {
                    id: recipe.id,
                  },
                },
              },
            });

            return tagCreated;
          });
        });

        resolve("Ingredients created");
      });

      await Promise.all([promise]).then((values) => {
        console.log("Promise All", values);
        return values;
      });
    }),
});