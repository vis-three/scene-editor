module.exports = {
  root: true,
  env: { es6: true, browser: true, node: true },
  globals: {
    VIS: true,
  },
  extends: ["eslint:recommended", "plugin:vue/recommended", "prettier"],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
    "no-debugger": "warn",
    "no-unused-vars": "warn",
    "no-self-assign": "off",
    "no-useless-escape": "off",
    "no-unreachable": "warn",
    "valid-typeof": "off",
    "vue/no-mutating-props": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-v-text-v-html-on-component": "off",
    "vue/require-default-prop": "off",
  },
};
