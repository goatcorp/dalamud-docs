module.exports = {
  plugins: [
    'preset-lint-consistent',
    'preset-lint-recommended',
    'preset-lint-markdown-style-guide',
    'preset-prettier',
    'remark-frontmatter',
    'remark-directive',
    'remark-gfm',
    ['remark-lint-maximum-heading-length', false],
    ['remark-lint-final-definition', false],
    ['remark-lint-no-file-name-mixed-case', false],
    ['remark-lint-no-undefined-references', false],
  ],
};
