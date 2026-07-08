import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Vitest's `globals` option isn't enabled, so `afterEach` isn't a global -
// @testing-library/react's automatic cleanup-between-tests relies on detecting
// that global, so it never registers without this, and DOM from each render()
// call accumulates across tests within the same file.
afterEach(() => {
  cleanup();
});
