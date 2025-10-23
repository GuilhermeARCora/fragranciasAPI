module.exports = {
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/**/index.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'html']
};
