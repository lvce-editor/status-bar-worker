import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleContextMenu from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.ts'
import * as MenuWorker from '../src/parts/MenuWorker/MenuWorker.ts'

test('handleContextMenu should show status bar context menu', async () => {
  using extensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getStatusBarItemContextMenuItems': async () => [],
  })
  using mockRpc = MenuWorker.registerMockRpc({
    'Menu.show2': async () => {},
  })
  const state = {
    ...createDefaultState(),
    uid: 1,
  }
  const result = await HandleContextMenu.handleContextMenu(state, 2, 100, 200)
  expect(result).toBe(state)
  expect(extensionManagementRpc.invocations).toEqual([])
  expect(mockRpc.invocations).toEqual([
    [
      'Menu.show2',
      1,
      MenuEntryId.StatusBar,
      100,
      200,
      {
        contextMenuItems: [],
        menuId: MenuEntryId.StatusBar,
      },
    ],
  ])
})

test('handleContextMenu queries the clicked item provider', async () => {
  using extensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getStatusBarItemContextMenuItems': async (extensionId: string, providerId: string) => {
      expect(extensionId).toBe('extension.git')
      expect(providerId).toBe('git.checkout')
      return [{ command: 'git.checkout', id: 'switch-main', label: 'Switch to main branch' }]
    },
  })
  using menuWorkerRpc = MenuWorker.registerMockRpc({
    'Menu.show2': async () => {},
  })
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        ariaLabel: 'feature',
        elements: [],
        extensionId: 'extension.git',
        name: 'git.showBranchPicker',
        providerId: 'git.checkout',
        tooltip: 'feature',
      },
    ],
    uid: 1,
  }

  await HandleContextMenu.handleContextMenu(state, 2, 100, 200, 'git.showBranchPicker')

  expect(extensionManagementRpc.invocations).toEqual([['Extensions.getStatusBarItemContextMenuItems', 'extension.git', 'git.checkout']])
  expect(menuWorkerRpc.invocations[0]?.[5]).toEqual({
    contextMenuItems: [{ command: 'git.checkout', id: 'switch-main', label: 'Switch to main branch' }],
    menuId: MenuEntryId.StatusBar,
  })
})
