import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { type shops } from "@/server/db/schema";

export const homeRouter = createTRPCRouter({
  getData: protectedProcedure.query(async ({ ctx }) => {
    const transactions = await db.query.transactions.findMany({
      where: (transaction, { eq }) =>
        eq(transaction.customerId, ctx.session.user.id),
      orderBy: (transaction, { desc }) => desc(transaction.createdAt),
      with: {
        shop: true,
      },
    });
    const shopsData = transactions
      .map((transaction) => transaction.shop)
      .reduce(
        (acc, shop) => {
          if (shop && !acc.find((s) => s.id === shop.id)) {
            acc.push(shop);
          }
          return acc;
        },
        [] as (typeof shops.$inferSelect)[],
      );
    return {
      shops: shopsData,
      transactions,
      user: ctx.session.user,
    };
  }),
});
