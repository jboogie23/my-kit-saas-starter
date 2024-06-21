import { APP_URL } from "$configs/general";
import type { RequestHandler } from "@sveltejs/kit";
import * as sitemap from "super-sitemap";

export const GET: RequestHandler = async () => {
  return await sitemap.response({
    origin: APP_URL,
    excludePatterns: [".*\\(admin\\).*", ".*\\(app\\).*", ".*\\[userId=userId\\].*"],
  });
};
