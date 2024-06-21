import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { AuthMethods } from "../../../types/enums/auth-methods.enum";
import { users } from "../schema";

export const oauthAccounts = sqliteTable(
  "oauth_accounts",
  {
    providerId: text("provider_id", { enum: [AuthMethods.EMAIL, AuthMethods.GITHUB, AuthMethods.GOOGLE] }).notNull(),
    providerUserId: text("provider_user_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$default(() => new Date()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.providerId, t.providerUserId] }) }),
);
