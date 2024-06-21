import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { generateId, TimeSpan } from "lucia";
import { createDate } from "oslo";

import { TOKEN_EXPIRATION_TIME, TOKEN_LEN } from "../../../configs/fields-length";
import { TokenType } from "../../../types/enums/token-type.enum";
import { users } from "../schema";

export const tokens = sqliteTable("tokens", {
  token: text("token", { length: TOKEN_LEN })
    .primaryKey()
    .$default(() => generateId(TOKEN_LEN)),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => createDate(new TimeSpan(TOKEN_EXPIRATION_TIME, "m"))),
  type: text("type", { enum: [TokenType.EMAIL_CHANGE, TokenType.EMAIL_VERIFICATION, TokenType.PASSWORD_RESET] }),
  email: text("email").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
