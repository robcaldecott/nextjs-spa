/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: ["^react", "<THIRD_PARTY_MODULES>", "^[.]"],
  tailwindFunctions: ["clsx"],
};

export default config;
