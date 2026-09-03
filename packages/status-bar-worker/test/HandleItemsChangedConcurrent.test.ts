import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('keeps the newest status bar items when refreshes overlap', async () => {
  let statusBarItemsCallCount = 0
  using extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getNotificationCount': async () => 0,
    'Extensions.getStatusBarItems': async () => {
      statusBarItemsCallCount++
      if (statusBarItemsCallCount === 1) {
        await new Promise((resolve) => setTimeout(resolve, 20))
        return []
      }
      return [{ id: 'git.sync', text: '2↓ 0↑' }]
    },
  })
  const state = { ...createDefaultState(), initial: false, uid: 42 }
  StatusBarStates.set(42, state, state)

  await Promise.all([commandMap['StatusBar.handleExtensionsChanged'](42), commandMap['StatusBar.handleChange'](42, 'git.sync')])

  expect(statusBarItemsCallCount).toBe(2)
  expect(extensionManagementWorkerRpc.invocations.filter(([command]) => command === 'Extensions.getStatusBarItems')).toHaveLength(2)
  expect(StatusBarStates.get(42).newState.statusBarItemsLeft[0].name).toBe('git.sync')
  expect(StatusBarStates.get(42).newState.statusBarItemsLeft[0].elements).toEqual([{ type: 'text', value: '2↓ 0↑' }])
})
