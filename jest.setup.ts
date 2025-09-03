const { configure } = require('jest');

configure({
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jsdom',
});