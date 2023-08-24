const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
  ],
  rules: {
    // js
    'eol-last': 'error',
    'no-trailing-spaces': 'error',
    'comma-style': ['error', 'last'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-multi-spaces': 'error',
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'object-curly-spacing': ['error', 'always'],
    'arrow-parens': ['error', 'as-needed'],
    'spaced-comment': ['error', 'always'],
    'semi': [2, 'always'],
    // vue
    'vue/no-v-html': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': ['error', { singleline: 3, multiline: 1 }],
    'vue/script-indent': ['error', 2, { baseIndent: 1, switchCase: 1 }],
    'vue/order-in-components': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-closing-bracket-spacing': 'error',
    'vue/require-prop-types': 'off',
    'vue/prop-name-casing': 'off',
    'vue/no-template-shadow': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/no-mutating-props': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/require-v-for-key': 'off',
    'vue/valid-v-for': 'off',
    'vue/no-unused-vars': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/no-multiple-template-root': 'off',
  },
});
