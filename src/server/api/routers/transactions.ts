import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

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
      const txn = await db
        .insert(transactions)
        .values({
          shopId: input.shopId,
          customerId: ctx.session.user.id,
          amount: input.amount,
          isPaid: false,
          notes: input.notes,
        })
        .returning();
      return txn;
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const txn = await db.query.transactions.findFirst({
        where: (transaction, { eq }) => eq(transaction.id, input.id),
        with: {
          shop: true,
        },
      });

      if (!txn) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaction not found",
        });
      }

      return txn;
    }),
});
