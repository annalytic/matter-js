// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  // @ts-ignore
  prettier,
  {
    ignores: ["build/*", "src/wireless_connector.js"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: tseslint.configs.recommendedTypeChecked,
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
);
