export default {
    moduleNameMapper: {
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    },
    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    rootDir: ".",
    testRegex: "test/units/.*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
};