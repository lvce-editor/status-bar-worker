import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...actions.default,
  {
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'sonarjs/no-trivial-assertions': 'off',
      'sonarjs/prefer-specific-assertions': 'off',
      'unicorn/no-top-level-assignment-in-function': 'off',
    },
  },
]
