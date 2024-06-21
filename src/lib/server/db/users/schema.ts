import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type Stripe from "stripe";

import { USER_ID_LEN } from "../../../configs/fields-length";
import { AuthMethods } from "../../../types/enums/auth-methods.enum";

export const users = sqliteTable("users", {
  id: text("id", { length: USER_ID_LEN }).notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  username: text("username").notNull().unique(),
  authMethods: text("auth_methods", { mode: "json" }).$type<AuthMethods[]>().notNull(),
  avatarUrl: text("avatar_url"),
  isVerified: integer("is_verified", { mode: "boolean" }).notNull().default(false),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  modifiedAt: integer("modified_at", { mode: "timestamp_ms" })
    .default(sql`null`)
    .$onUpdate(() => new Date()),
  customerId: text("customer_id").unique(),
  subscriptionId: text("subscription_id"),
  subscriptionStatus: text("subscription_status").$type<Stripe.Subscription.Status>(),
});
