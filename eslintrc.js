// .eslintrc.js
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
    rules: {
        'react/react-in-jsx-scope': 'off', // Not needed in Next.js
        '@typescript-eslint/no-unused-vars': 'warn',
    },
};
