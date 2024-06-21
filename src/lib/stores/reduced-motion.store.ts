import { type Readable, readable } from "svelte/store";

import { browser } from "$app/environment";

const value = browser && window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;

/**
 * Detect if user has enabled animations from OS settings.
 * More info at https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 */
export const prefersReducedMotion: Readable<boolean> = readable(value);
