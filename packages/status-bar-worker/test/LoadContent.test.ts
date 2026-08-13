import { afterEach, expect, test } from '@jest/globals'
import { ExtensionManagementWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import * as NotificationCount from '../src/parts/NotificationCount/NotificationCount.ts'

afterEach(() => {
  NotificationCount.reset()
})

test('uses a notification count received while content is loading', async () => {
  using rendererWorkerRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => undefined,
  })
  using extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getNotificationCount': async () => 0,
    'Extensions.getStatusBarItems': async () => [],
  })
  NotificationCount.set(3)

  const result = await loadContent(createDefaultState())

  expect(result.statusBarItemsRight).toHaveLength(1)
  expect(result.statusBarItemsRight[0].ariaLabel).toBe('3 Notifications')
  expect(rendererWorkerRpc.invocations).toHaveLength(3)
  expect(extensionManagementWorkerRpc.invocations).toEqual([
    ['Extensions.activateByEvent', 'onStatusBarItem', '', 0],
    ['Extensions.getStatusBarItems'],
    ['Extensions.getNotificationCount'],
  ])
})
