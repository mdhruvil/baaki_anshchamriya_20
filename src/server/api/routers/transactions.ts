import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        shopId: z.number().min(1),
        amount: z.number().min(1),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const txn = await db.insert(transactions).values({
        shopId: input.shopId,
        customerId: ctx.session.user.id,
        amount: input.amount,
        isPaid: false,
        notes: input.notes,
      });
      return txn;
    }),
});
