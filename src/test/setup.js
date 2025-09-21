import '@testing-library/jest-dom';

// Mock wagmi
global.mockWagmiHooks = {
  useAccount: () => ({ address: null, isConnected: false }),
  useWalletClient: () => ({ data: null, isError: false, isLoading: false }),
};

// Mock environment variables if needed
global.process = global.process || {};
global.process.env = global.process.env || {};

// Suppress console warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});