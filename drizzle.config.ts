import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Config } from "drizzle-kit";

/**
 * This is a temporary fix because of a drizzle-kit bug
 * https://github.com/drizzle-team/drizzle-kit-mirror/issues/321
 * So we can use better-sqlite3 driver instead of D1
 * You can delete this code and "better-sqlite3" dependency when this issue will be fixed
 */
const getLocalDb = () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dbPath = path.resolve(__dirname, "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject");
  const files = fs.readdirSync(dbPath);

  for (const file of files) {
    if (file.endsWith(".sqlite")) {
      return path.resolve(dbPath, file);
    }
  }
};

export default {
  schema: "src/lib/server/db/schema.ts",
  out: "migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: getLocalDb(),
  },
  //   dbCredentials = {
  //     wranglerConfigPath: "wrangler.toml",
  //     dbName: "kss-prod"
  //   };
} satisfies Config;
