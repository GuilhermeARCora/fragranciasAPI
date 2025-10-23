module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  plugins: ['import'],
  extends: ['eslint:recommended', 'airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'script'
  },
  rules: {
    // Qualidade básica
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: 'next' }],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['req', 'res', 'err']
      }
    ],
    'no-plusplus': 'off',
    'func-names': 'off',

    // Node / imports
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/extensions': ['error', 'ignorePackages', { js: 'never' }],
    'import/prefer-default-export': 'off',

    // Mongo/Mongoose convenções
    'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],

    // Estilo
    'comma-dangle': ['error', 'never'],
    quotes: ['error', 'single'],
    semi: ['error', 'always']
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js']
      }
    }
  }
};
