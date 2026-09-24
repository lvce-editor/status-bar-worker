import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleExtensionManagementChange } from '../src/parts/HandleExtensionManagementChange/HandleExtensionManagementChange.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('renders extension item changes through the direct renderer connection', async () => {
  using mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getNotificationCount': async () => 0,
    'Extensions.getStatusBarItems': async () => [{ id: 'sample.status', text: 'Ready' }],
  })
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 17)
  const sendMultiple = jest.fn()
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands, 'Viewlet.sendMultiple': sendMultiple } }))
  const state = { ...createDefaultState(), initial: false, uid: 42 }
  StatusBarStates.set(42, state, state)

  await handleExtensionManagementChange()

  expect(mockExtensionManagementRpc.invocations).toEqual([
    ['Extensions.activateByEvent', 'onStatusBarItem', '', 0],
    ['Extensions.getStatusBarItems'],
    ['Extensions.getNotificationCount'],
  ])
  expect(queueCommands).toHaveBeenCalledTimes(1)
  expect(sendMultiple).toHaveBeenCalledWith([['Viewlet.commitPending', 42, 17]])
})

test('defers extension item rendering until the status bar has mounted', async () => {
  using mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getNotificationCount': async () => 0,
    'Extensions.getStatusBarItems': async () => [{ id: 'sample.status', text: 'Ready' }],
  })
  const queueCommands = jest.fn()
  const sendMultiple = jest.fn()
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands, 'Viewlet.sendMultiple': sendMultiple } }))
  const state = { ...createDefaultState(), initial: true, uid: 42 }
  StatusBarStates.set(42, state, state)

  await handleExtensionManagementChange()

  expect(mockExtensionManagementRpc.invocations).toEqual([
    ['Extensions.activateByEvent', 'onStatusBarItem', '', 0],
    ['Extensions.getStatusBarItems'],
    ['Extensions.getNotificationCount'],
  ])
  expect(StatusBarStates.get(42).newState.statusBarItemsLeft).toHaveLength(1)
  expect(StatusBarStates.get(42).newState.statusBarItemsLeft[0].name).toBe('sample.status')
  expect(queueCommands).not.toHaveBeenCalled()
  expect(sendMultiple).not.toHaveBeenCalled()
})

test('preserves mounted state when an extension refresh started during loading', async () => {
  const pendingItems = Promise.withResolvers<readonly { id: string; text: string }[]>()
  const requestedItems = Promise.withResolvers<void>()
  using mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getNotificationCount': async () => 0,
    'Extensions.getStatusBarItems': async () => {
      requestedItems.resolve()
      return pendingItems.promise
    },
  })
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 18)
  const sendMultiple = jest.fn()
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands, 'Viewlet.sendMultiple': sendMultiple } }))
  const loading = { ...createDefaultState(), initial: true, uid: 42 }
  StatusBarStates.set(42, loading, loading)

  const refresh = handleExtensionManagementChange()
  await requestedItems.promise
  const mounted = { ...loading, initial: false, warningCount: 3 }
  StatusBarStates.set(42, mounted, mounted)
  pendingItems.resolve([{ id: 'git.sync', text: '2↓ 0↑' }])
  await refresh

  expect(StatusBarStates.get(42).newState.initial).toBe(false)
  expect(StatusBarStates.get(42).newState.warningCount).toBe(3)
  expect(StatusBarStates.get(42).newState.statusBarItemsLeft[0].elements).toContainEqual({ type: 'text', value: '2↓ 0↑' })
  expect(queueCommands).toHaveBeenCalledTimes(1)
  expect(sendMultiple).toHaveBeenCalledWith([['Viewlet.commitPending', 42, 18]])
})
