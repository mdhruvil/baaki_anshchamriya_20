import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const shopRouter = createTRPCRouter({
  findByUpiId: publicProcedure
    .input(z.object({ upiId: z.string().min(1) }))
    .query(async ({ input }) => {
      const shop = await db.query.shops.findFirst({
        where: (shop, { eq }) => eq(shop.upiId, input.upiId),
      });
      if (!shop) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No shop with this UPI ID found",
        });
      }
      return shop;
    }),
});
