import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { GitHub, Google } from "arctic";
import { Lucia, TimeSpan } from "lucia";
import type Stripe from "stripe";

import { dev } from "$app/environment";
import { SESSION_COOKIE_NAME } from "$configs/cookies-names";
import { SESSION_EXPIRATION_TIME } from "$configs/fields-length";
import { APP_URL } from "$configs/general";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";

const GOOGLE_REDIRECT_URI = `${APP_URL}/auth/oauth/google/callback`;

export const githubOauth = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
export const googleOauth = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

export function initializeLucia(db: D1Database) {
  const adapter = new D1Adapter(db, {
    user: "users",
    session: "sessions",
  });

  return new Lucia(adapter, {
    sessionExpiresIn: new TimeSpan(SESSION_EXPIRATION_TIME, "d"),
    sessionCookie: {
      name: SESSION_COOKIE_NAME,
      attributes: {
        secure: !dev,
      },
    },
    getUserAttributes: (data) => {
      return {
        id: data.id,
        username: data.username,
        name: data.name,
        email: data.email,
        authMethods: JSON.parse(data.auth_methods),
        avatarUrl: data.avatar_url,
        isVerified: !!data.is_verified,
        isAdmin: !!data.is_admin,
        createdAt: new Date(data.created_at).toISOString(),
        modifiedAt: data.modified_at ? new Date(data.modified_at).toISOString() : null,
        customerId: data.customer_id,
        subscriptionId: data.subscription_id,
        subscriptionStatus: data.subscription_status,
      };
    },
  });
}

// TODO this is an hardcoded interface, can we retrieve it from drizzle?
interface DatabaseUserAttributes {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  auth_methods: string;
  avatar_url: string;
  is_verified: boolean;
  is_admin: boolean;
  created_at: Date;
  modified_at: Date;
  customer_id: string;
  subscription_id: string;
  subscription_status: Stripe.Subscription.Status;
}

declare module "lucia" {
  export interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    Auth: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
