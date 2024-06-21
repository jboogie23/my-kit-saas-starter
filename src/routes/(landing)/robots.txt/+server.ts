import { APP_URL } from "$configs/general";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${APP_URL}/sitemap.xml`].join("\n").trim();

  const headers = {
    "Content-Type": "text/plain",
  };

  return new Response(body, { headers });
};
