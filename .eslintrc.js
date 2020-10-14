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
    semi: ["off", "never"],
    quotes: ["off", "never"],
    camelcase: "off",
    'space-before-blocks' : ["off","never"],
    'keyword-spacing': "off",
    'indent' : "off"
  },

};
