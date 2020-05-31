module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/middlewares",
    "/src/schemas",
    "/src/utils",
    "/src/migrations",
    "/tests/",
    "/src/cpp/",
    "/build/"
  ],
  coverageReporters: ["json-summary", "lcov", "text"],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  globals: {
    "ts-jest": {
      diagnostics: false,
      isolatedModules: true
    }
  },
  modulePaths: ["<rootDir>/src/"],
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts?(x)"]
};
