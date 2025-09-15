// Tests setup
import { config } from '@vue/test-utils'

// Global test setup
beforeEach(() => {
  // Reset any state between tests
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock
