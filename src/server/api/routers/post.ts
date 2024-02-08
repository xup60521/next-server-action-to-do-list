import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  
  create: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input,
      });
    }),

  getPost: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  deletePost: publicProcedure.input(z.number()).mutation(
    async ({ctx, input}) => {
      await ctx.db.delete(posts).where(eq(posts.id, input));
    }
  )
});
