import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
    rules: {
      // TODO delete this line when the following PR will be merged
      // https://github.com/sveltejs/eslint-plugin-svelte/issues/348
      "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^\\$\\$(Props|Events|Slots)$" }],
      // TODO this should be deleted, it's a known bug
      // https://github.com/sveltejs/eslint-plugin-svelte/issues/652
      "svelte/valid-compile": "off",
    },
  },
  {
    ignores: ["build/", ".svelte-kit/", "dist/", "coverage/", "src/paraglide/"],
  },
];
