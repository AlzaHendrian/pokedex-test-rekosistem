module.exports = {
  // Remove jest-expo preset - use pure Jest
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Transform TypeScript files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Test patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx,js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx,js,jsx}'
  ],
  
  // Module resolution
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  
  // Transform ignore patterns - much simpler
  transformIgnorePatterns: [
    'node_modules/(?!(zustand|axios)/)'
  ],
  
  // Clear mocks
  clearMocks: true,
  
  // Coverage
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/__tests__/**'
  ],
  
  // TS-Jest configuration
  globals: {
    'ts-jest': {
      useESM: false,
      tsconfig: {
        jsx: 'react-jsx'
      }
    }
  }
};