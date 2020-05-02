module.exports = {
  preset: 'ts-jest',
  runner: '@jest-runner/electron/main',
  testEnvironment: 'node',
  // test in renderer process:
  /*
  runner: '@jest-runner/electron',
  testEnvironment: '@jest-runner/electron/environment',
  */
};
