import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default {
  files: ["**/*.vue", "**/*.{js,jsx,ts,tsx}"],
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tsparser,
      extraFileExtensions: [".vue"],
      ecmaVersion: "latest",
      sourceType: "module",
    },
    globals: {
      window: "readonly",
      document: "readonly",
      navigator: "readonly",
      console: "readonly",
    },
  },
  plugins: {
    "@typescript-eslint": tseslint,
    vue: vue,
  },
  rules: {
    ...eslint.configs.recommended.rules,
    ...tseslint.configs.recommended.rules,
    ...vue.configs.recommended.rules,
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-unused-vars": "error",
  },
};
