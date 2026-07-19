import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...config.recommendedVirtualDom,
  ...actions.default,
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
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
  {
    files: [
      'packages/status-bar-worker/src/parts/ContentLoadedEffects/ContentLoadedEffects.ts',
      'packages/status-bar-worker/src/parts/HandleContextMenu/HandleContextMenu.ts',
      'packages/status-bar-worker/src/parts/ItemLeftUpdate/ItemLeftUpdate.ts',
    ],
    rules: {
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
]
