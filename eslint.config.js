import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedVirtualDom,
  ...config.recommendedActions,
  {
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'jest/no-disabled-tests': 'off',
      'sonarjs/no-trivial-assertions': 'off',
      'sonarjs/prefer-specific-assertions': 'off',
      'unicorn/no-top-level-assignment-in-function': 'off',
    },
  },
  {
    files: ['packages/status-bar-worker/test/**/*.ts'],
    rules: {
      'virtual-dom/no-empty-aria': 'off',
      'virtual-dom/prefer-constants': 'off',
      'virtual-dom/prefer-merge-class-names': 'off',
    },
  },
  {
    // The application runtime has its own Node version in the pinned checkout.
    files: ['.github/workflows/integration.yml'],
    rules: { 'github-actions/node-version-file': 'off' },
  },
])
