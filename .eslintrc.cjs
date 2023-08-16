module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        requireConfigFile: false
    },
    plugins: [
        '@typescript-eslint'
    ],
    env: {
        node: true
    },
    extends: [
        'google'
    ],
    // custom rules
    rules: {
        'arrow-parens': 0,
        'comma-dangle': ['error', 'never'],
        'indent': 'off',
        'max-len': 0,
        'import/extensions': 0,
        'import/no-unresolved': 0,
        'import/no-extraneous-dependencies': 0,
        'spaced-comment': ['error', 'always', {'markers': ['/']}],
        'space-before-function-paren': ['error', 'always'],
        'space-in-parens': ['error', 'never'],
        'require-jsdoc': 0,
        'semi': 'off',
        'space-infix-ops': 'off',
        '@typescript-eslint/semi': 'error',
        '@typescript-eslint/space-infix-ops': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/member-delimiter-style': 'error',
        '@typescript-eslint/type-annotation-spacing': ['error', {before: false, after: true, overrides: {
            arrow: {
                before: true,
                after: true
            }
        }}],
        '@typescript-eslint/func-call-spacing': ['error'],
        '@typescript-eslint/no-unused-vars': 'error',
        'no-unused-vars': 'off'
    }
};
