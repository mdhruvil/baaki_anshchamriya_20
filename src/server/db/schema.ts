import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";

export const shops = sqliteTable(
  "shops",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    image: text("image"),
    merchantId: text("merchant_id").references(() => users.id),
    phoneNumber: text("phone_number").notNull(),
    upiId: text("upi_id").notNull(),
    name: text("name").notNull(),
    address: text("address"),
    status: text("status", { enum: ["active", "inactive", "deleted"] }).default(
      "active",
    ),
    createdAt: int("created_at", { mode: "timestamp" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    updatedAt: int("updated_at", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    merchantIdIdx: index("merchant_id_idx").on(table.merchantId),
    upiIdIdx: index("upi_id_idx").on(table.upiId),
    phoneNumberIdx: index("phone_number_idx").on(table.phoneNumber),
  }),
);

export const shopsRelations = relations(shops, ({ one, many }) => ({
  merchant: one(users, { fields: [shops.merchantId], references: [users.id] }),
  transactions: many(transactions),
}));

export const transactions = sqliteTable(
  "transactions",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    shopId: int("shop_id").references(() => shops.id),
    customerId: text("customer_id").references(() => users.id),
    amount: real("amount").notNull(),
    notes: text("notes"),
    isPaid: int("is_paid", { mode: "boolean" }).notNull(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => ({
    shopIdIdx: index("transactions_shop_id_idx").on(table.shopId),
    customerIdIdx: index("transactions_customer_id_idx").on(table.customerId),
  }),
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  shop: one(shops, { fields: [transactions.shopId], references: [shops.id] }),
  customer: one(users, {
    fields: [transactions.customerId],
    references: [users.id],
  }),
}));

export const users = sqliteTable("user", {
  id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull(),
  emailVerified: int("email_verified", {
    mode: "timestamp",
  }).default(sql`(unixepoch())`),
  image: text("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  shops: many(shops),
  transactions: many(transactions),
}));

export const accounts = sqliteTable(
  "account",
  {
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = sqliteTable(
  "session",
  {
    sessionToken: text("session_token", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = sqliteTable(
  "verification_token",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
