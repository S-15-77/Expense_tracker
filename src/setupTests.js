// src/setupTests.js
import '@testing-library/jest-dom';

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.open
global.open = jest.fn();

// Mock alert and confirm
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

// Mock prompt
global.prompt = jest.fn(() => 'Test Input');
