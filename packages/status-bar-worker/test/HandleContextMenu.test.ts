import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleContextMenu from '../src/parts/HandleContextMenu/HandleContextMenu.ts'

test('handleContextMenu should return the same state object', async () => {
  const state = createDefaultState()
  const result = await HandleContextMenu.handleContextMenu(state)
  expect(result).toBe(state)
})
