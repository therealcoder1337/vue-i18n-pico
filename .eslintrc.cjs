module.exports = {
    root: true,
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        requireConfigFile: false
    },
    env: {
        node: true
    },
    extends: ['google'],
    plugins: ['import'],
    rules: {
        'arrow-parens': 0,
        'comma-dangle': ['error', 'never'],
        'indent': ['error', 4],
        'max-len': 0,
        'import/extensions': ['error', 'always'],
        'import/no-extraneous-dependencies': 0,
        'space-before-function-paren': ['error', 'always'],
        'space-in-parens': ['error', 'never'],
        'require-jsdoc': 0
    }
};
