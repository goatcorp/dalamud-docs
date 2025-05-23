module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.md', '*.mdx'],
      extends: ['plugin:mdx/recommended'],
    },
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint'],
  root: true,
  env: {
    browser: true,
    node: true,
  },
  settings: {
    'mdx/code-blocks': true,
    // Integration with remark-lint plugins,
    // it will read remark's configuration automatically via .remarkrc.js
    'mdx/remark': true,
  },
};
