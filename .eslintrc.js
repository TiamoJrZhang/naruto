/** @format */

module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'prettier',
    'prettier/react',
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [2, {args: 'none'}],
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 2,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
      },
    },
  ],
  rules: {
    camelcase: 0,
    'react/jsx-one-expression-per-line': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-indent': 0,
    'react/jsx-wrap-multilines': ['error', {declaration: false, assignment: false}],
    'import/extensions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-has-content': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'react/jsx-filename-extension': 0,
    'react/state-in-constructor': 0,
    'react/jsx-props-no-spreading': 0,
    'prefer-destructuring': 0, // TODO: remove later
    'consistent-return': 0, // TODO: remove later
    'no-return-assign': 0, // TODO: remove later
    'no-param-reassign': 0, // TODO: remove later
    'react/destructuring-assignment': 0, // TODO: remove later
    'react/no-did-update-set-state': 0, // TODO: remove later
    'react/require-default-props': 0,
    'react/default-props-match-prop-types': 0,
    'import/no-cycle': 0,
    'react/no-find-dom-node': 0,
    'no-underscore-dangle': 0,
    'react/sort-comp': 0,
    // label-has-for has been deprecated
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
    'jsx-a11y/label-has-for': 0,
    // for (let i = 0; i < len; i++)
    'no-plusplus': 0,
    // https://eslint.org/docs/rules/no-continue
    // labeledLoop is conflicted with `eslint . --fix`
    'no-continue': 0,
    'no-console': 0,
    'react/display-name': 0,
    // ban this for Number.isNaN needs polyfill
    'no-restricted-globals': 0,
    'max-classes-per-file': 0,
    'react/static-property-placement': 0,
    'jest/no-test-callback': 0,
    'jest/expect-expect': 0,
    'react-hooks/rules-of-hooks': 2, // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 2, // 检查 effect 的依赖
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    // 'unicorn/better-regex': 2,
    // 'unicorn/prefer-trim-start-end': 2,
    // 'unicorn/expiring-todo-comments': 2,
    // 'unicorn/no-abusive-eslint-disable': 2,
  },
}
