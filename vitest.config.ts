import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['**/node_modules/**', '**/dist/**', '**/bklit-ui-temp/**']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
