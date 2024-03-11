module.exports = {
  plugins: [
    'preset-lint-consistent',
    'preset-lint-recommended',
    'preset-lint-markdown-style-guide',
    'preset-prettier',
    'remark-frontmatter',
    'remark-gfm',
    ['remark-lint-maximum-heading-length', false],
    ['remark-lint-final-definition', false],
    ['remark-lint-no-file-name-mixed-case', false],
  ],
};
