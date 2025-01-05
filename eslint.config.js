import globals from "globals";
import pluginJs from "@eslint/js";

const globalRules = {
  "no-unused-vars": "warn",
  "no-var": "warn"
};

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "**/*.min.js",
      "lib/jquery.js"
    ]
  },
  pluginJs.configs.recommended,
  {
    files: [
      "sw.js",
      "lib/ragaboom.min.js",
      "lib/ragaboom.js"
    ],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        $: "readonly",
        RB: "readonly",
        cgd: "readonly",
        ...globals.browser
      }
    },
    rules: globalRules
  },
  {
    files: [
      "lib/comicgen.js"
    ],
    languageOptions: {
      sourceType: "module",
      globals: {
        $: "readonly",
        RB: "readonly",
        ...globals.browser
      }
    },
    rules: globalRules
  },
  {
    files: [
      "bdchapril.js",
      "data/cgdata.js"
    ],
    languageOptions: {
      sourceType: "module",
      globals: globals.browser
    },
    rules: globalRules
  }
];