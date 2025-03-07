import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";

export const chatRouter = createTRPCRouter({
  getTransactionsByShopId: protectedProcedure
    .input(z.object({ shopId: z.number() }))
    .query(async ({ input }) => {
      const { shopId } = input;

      const transactions = await db.query.transactions.findMany({
        where: (transaction, { eq }) => eq(transaction.shopId, shopId),
        orderBy: (transaction, { asc }) => asc(transaction.createdAt),
        with: {
          shop: true,
        },
      });

      const shop = await db.query.shops.findFirst({
        where: (shops, { eq }) => eq(shops.id, shopId),
      });

      if (!shop) {
        throw new Error(`Shop with ID ${shopId} not found`);
      }

      return {
        shop,
        transactions,
      };
    }),
});
