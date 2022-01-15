/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["<rootDir>/tests"],
  globals: {
    "ts-jest": {
      tsconfig: {
        esModuleInterop: true,
      },
    },
  },
};
