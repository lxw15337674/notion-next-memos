module.exports = {
  plugins: ["import"],
  extends: ["plugin:@next/next/recommended"],
  rules: {
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    camelcase: "off",
    "import/prefer-default-export": "off",
    "react/jsx-filename-extension": "off",
    "react/jsx-props-no-spreading": "off",
    "react/no-unused-prop-types": "off",
    "react/require-default-props": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "import/extensions": "off",
    "jsx-a11y": "off",
  },
  overrides: [
    {
      files: "**/*.+(ts|tsx)",
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],
};