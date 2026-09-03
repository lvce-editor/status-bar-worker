import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('workspace changes reactivate extension status bar items', async () => {
  using extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getNotificationCount': async () => 0,
    'Extensions.getStatusBarItems': async () => [{ id: 'git.sync', text: '2↓ 0↑' }],
  })
  const state = { ...createDefaultState(), initial: false, uid: 42 }
  StatusBarStates.set(42, state, state)

  await commandMap['StatusBar.handleWorkspaceChange'](42, '/workspace')

  expect(extensionManagementWorkerRpc.invocations).toEqual([
    ['Extensions.activateByEvent', 'onStatusBarItem', '', 0],
    ['Extensions.getStatusBarItems'],
    ['Extensions.getNotificationCount'],
  ])
  expect(StatusBarStates.get(42).newState.statusBarItemsLeft[0].name).toBe('git.sync')
  expect(StatusBarStates.get(42).newState.statusBarItemsLeft[0].elements).toEqual([{ type: 'text', value: '2↓ 0↑' }])
})
