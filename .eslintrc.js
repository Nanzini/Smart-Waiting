module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ["standard"],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },

  rules: {
    "comma-dangle": ["off", "never"],
    semi: ["warn", "always"],
    quotes: ["warn", "double"],
    camelcase: "off",
  },
};
