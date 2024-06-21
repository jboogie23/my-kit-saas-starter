import { sequence } from "@sveltejs/kit/hooks";

import { authentication, authorization, database, error, internationalization } from "./handlers";

export const handleError = error;

export const handle = sequence(database, internationalization, authentication, authorization);
