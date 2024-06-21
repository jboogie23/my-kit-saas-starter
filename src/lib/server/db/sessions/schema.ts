import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { SESSION_ID_LEN } from "../../../configs/fields-length";
import { users } from "../users/schema";

export const sessions = sqliteTable("sessions", {
  id: text("id", { length: SESSION_ID_LEN }).notNull().primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
