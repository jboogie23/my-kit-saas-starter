import { and, eq } from "drizzle-orm";

import { AuthMethods } from "$types/enums/auth-methods.enum";

import { oauthAccounts } from "../schema";
import type { Database } from "../types";
import type { DbInsertOauthAccount, DbOauthAccount } from "./types";

/*
 * CREATE
 **/
export async function createOauthAccount(db: Database, newOauthAccount: DbInsertOauthAccount): Promise<DbOauthAccount | undefined> {
  const res = await db.insert(oauthAccounts).values(newOauthAccount).onConflictDoNothing().returning();

  if (res.length === 0) return;

  return res[0];
}

/*
 * READ
 **/
export async function getOAuthAccountByProviderUserId(
  db: Database,
  providerId: AuthMethods,
  providerUserId: string,
): Promise<DbOauthAccount | undefined> {
  if (!providerId || !providerUserId) return;

  return await db.query.oauthAccounts.findFirst({
    where: and(eq(oauthAccounts.providerId, providerId), eq(oauthAccounts.providerUserId, providerUserId)),
  });
}

/*
 * UPDATE
 **/

/*
 * DELETE
 **/
