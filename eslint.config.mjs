import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Other build output dirs in this repo — without these, ESLint was
    // scanning compiled bundle chunks under nexttest/ (thousands of
    // false-positive "problems" from minified/bundled node_modules code,
    // not real source issues).
    "nexttest/**",
    ".qodo/**",
  ]),
]);

export default eslintConfig;
