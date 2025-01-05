import globals from "globals";
import pluginJs from "@eslint/js";

const globalRules = {
  "no-unused-vars": "warn"
};

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "**/*.min.js",
      "lib/jquery-3.7.1.js"
    ]
  },
  pluginJs.configs.recommended,
  {
    files: [
      "lib/comicgen.js",
      "sw.js",
      "data/cgdata.js"
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
    files: [ "bdchapril.js" ],
    languageOptions: {
      sourceType: "module",
      globals: globals.browser
    },
    rules: globalRules
  }
];