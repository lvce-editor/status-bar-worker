import { afterEach, expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker, RendererProcess as RendererProcessRegistry } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleExtensionsChanged } from '../src/parts/HandleExtensionsChanged/HandleExtensionsChanged.ts'
import { handleNotificationCountChangedAll } from '../src/parts/HandleNotificationCountChangedAll/HandleNotificationCountChangedAll.ts'
import * as NotificationCount from '../src/parts/NotificationCount/NotificationCount.ts'
import { renderOutOfBand } from '../src/parts/RenderOutOfBand/RenderOutOfBand.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

afterEach(async () => {
  await RendererProcessRegistry.dispose()
  NotificationCount.reset()
})

test('notification broadcasts preserve views with notifications disabled', async () => {
  const state = { ...createDefaultState(), initial: false, uid: 901 }
  StatusBarStates.set(state.uid, state, state)
  const sendMultiple = jest.fn()
  const rpc = createMockRpc({ commandMap: { 'Viewlet.sendMultiple': sendMultiple } })
  RendererProcess.set(Object.assign(rpc, { dispose: jest.fn() }))
  await handleNotificationCountChangedAll(4)
  expect(StatusBarStates.get(state.uid).newState).toBe(state)
  expect(NotificationCount.get()).toBe(4)
  expect(sendMultiple).not.toHaveBeenCalled()
})

test('unchanged initialized views do not send render commands', async () => {
  const state = { ...createDefaultState(), initial: false, uid: 902 }
  StatusBarStates.set(state.uid, state, state)
  const sendMultiple = jest.fn()
  const rpc = createMockRpc({ commandMap: { 'Viewlet.sendMultiple': sendMultiple } })
  RendererProcess.set(Object.assign(rpc, { dispose: jest.fn() }))
  await renderOutOfBand(state.uid)
  expect(sendMultiple).not.toHaveBeenCalled()
})

test('an older extension refresh cannot replace a newer result', async () => {
  const firstItems = Promise.withResolvers<readonly any[]>()
  let calls = 0
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getNotificationCount': async () => 0,
    'Extensions.getStatusBarItems': async () => {
      calls++
      return calls === 1 ? firstItems.promise : [{ id: 'latest', text: 'latest' }]
    },
  })
  const state = { ...createDefaultState(), uid: 903 }
  const first = handleExtensionsChanged(state)
  const second = await handleExtensionsChanged(state)
  firstItems.resolve([{ id: 'stale', text: 'stale' }])
  expect(await first).toBe(state)
  expect(second.statusBarItemsLeft.map((item) => item.name)).toEqual(['latest'])
})
