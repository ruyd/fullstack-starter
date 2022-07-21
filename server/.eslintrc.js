/* eslint-disable no-undef */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ["dist"],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'no-console': 'warn',
  }
}