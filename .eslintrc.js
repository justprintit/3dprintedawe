// vim: ts=2 sw=2 et:
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    //"eslint:recommended",
    "plugin:vue/essential",
    //"plugin:@typescript-eslint/recommended"
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 13,
    parser: "@typescript-eslint/parser"
  },
  plugins: [
    "vue",
    "@typescript-eslint"
  ],
  rules: {
    "vue/multi-word-component-names": [
      "error",
      {
        "ignores": ["index"]
      }
    ]
  }
}
