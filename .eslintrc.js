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
    semi: "1",
    quotes: ["1", "double"],
  },
};
