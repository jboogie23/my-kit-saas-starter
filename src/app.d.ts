import type { ParaglideLocals } from "@inlang/paraglide-sveltekit";
import type { Lucia, Session, User } from "lucia";

import type { AvailableLanguageTag } from "$paraglide/runtime";
import type { Database } from "$server/db";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface PageState {}
    interface PageData {
      flash?: FlashMessage;
    }
    namespace Superforms {
      type Message = FlashMessage;
    }
    interface Locals {
      paraglide: ParaglideLocals<AvailableLanguageTag>;
      db: Database;
      lucia: Lucia;
      user: User | null;
      session: Session | null;
    }
    interface Platform {
      env: Env;
      cf: CfProperties;
      ctx: ExecutionContext;
    }
  }
  namespace Superforms {
    type Message = FlashMessage;
  }
}

export {};
