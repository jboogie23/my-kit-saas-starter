import { D1Database } from "@cloudflare/workers-types/2022-11-30";
import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/d1";
import { Argon2id } from "oslo/password";
import { getPlatformProxy } from "wrangler";

import { USER_ID_LEN } from "../src/lib/configs/fields-length";
import { schema } from "../src/lib/server/db";
import { createUser } from "../src/lib/server/db/users";
import { AuthMethods } from "../src/lib/types/enums/auth-methods.enum";

async function main() {
  const { env } = await getPlatformProxy();
  const db = drizzle(env.DB as D1Database, { schema });
  const argon2id = new Argon2id();

  for (let i = 0; i < 10; i++) {
    const id = faker.string.alphanumeric(USER_ID_LEN);
    const password = await argon2id.hash("Password123." + process.env.AUTH_SECRET + id);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const username = faker.internet.userName({ firstName, lastName });

    const newUser = {
      id: id,
      name: `${firstName} ${lastName}`,
      email: email,
      username: username,
      password: password,
      authMethods: [AuthMethods.EMAIL],
      avatarUrl: faker.image.avatar(),
      isVerified: true,
      isAdmin: Math.random() < 0.5,
    };

    await createUser(db, newUser);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
