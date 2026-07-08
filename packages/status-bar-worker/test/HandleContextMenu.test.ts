import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleContextMenu from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.ts'

test('handleContextMenu should show status bar context menu', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })
  const state = {
    ...createDefaultState(),
    uid: 1,
  }
  const result = await HandleContextMenu.handleContextMenu(state, 2, 100, 200)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([
    [
      'ContextMenu.show2',
      1,
      MenuEntryId.StatusBar,
      100,
      200,
      {
        menuId: MenuEntryId.StatusBar,
      },
    ],
  ])
})
