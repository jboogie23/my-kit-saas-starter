import type { Cookies } from "@sveltejs/kit";
import { generateId, Lucia } from "lucia";
import { isWithinExpirationDate } from "oslo";

import { SESSION_ID_LEN } from "$configs/fields-length";
import { TokenType } from "$types/enums/token-type.enum";

import type { Database } from "../db";
import { createToken, type DbToken, deleteAllTokensByUserId, deleteToken, getTokenByUserId } from "../db/tokens";

export async function generateToken(db: Database, userId: string, email: string, type: TokenType): Promise<DbToken | undefined> {
  if (!userId || !email || !type) return;

  await deleteAllTokensByUserId(db, userId, type);

  const token = await createToken(db, { userId, type, email });
  if (!token) return;

  return token;
}

export async function verifyToken(db: Database, userId: string, token: string, type: TokenType, email?: string): Promise<string | undefined> {
  if (!userId || !token || !type) return;

  const tokenFromDatabase = await getTokenByUserId(db, userId, type);
  if (!tokenFromDatabase || tokenFromDatabase.token !== token) return;

  const deletedToken = await deleteToken(db, token, type);
  if (!deletedToken) return;

  const isExpired = !isWithinExpirationDate(tokenFromDatabase.expiresAt);
  if (isExpired) return;

  // in case of verify email and reset password journey, we also need to verify the email
  if (email && type !== TokenType.EMAIL_CHANGE && email !== tokenFromDatabase.email) return;

  // we return email because we need it in email change journey
  return tokenFromDatabase.email;
}

export function setNewSession(lucia: Lucia, sessionId: string, cookies: Cookies) {
  const { name, value, attributes } = lucia.createSessionCookie(sessionId);

  cookies.set(name, value, { ...attributes, path: "/" });
}

export function destroySession(lucia: Lucia, cookies: Cookies) {
  const { name, value, attributes } = lucia.createBlankSessionCookie();

  cookies.set(name, value, { ...attributes, path: "/" });
}

export const createAndSetSession = async (lucia: Lucia, userId: string, cookies: Cookies) => {
  const sessionId = generateId(SESSION_ID_LEN);
  const session = await lucia.createSession(userId, {}, { sessionId });

  setNewSession(lucia, session.id, cookies);
};
