import { afterEach, expect, test } from '@jest/globals'
import { ExtensionManagementWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as EditorStatusState from '../src/parts/EditorStatusState/EditorStatusState.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import * as NotificationCount from '../src/parts/NotificationCount/NotificationCount.ts'

afterEach(() => {
  EditorStatusState.reset()
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

test('uses editor status received before content is loading', async () => {
  using _rendererWorkerRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => undefined,
  })
  using _extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getNotificationCount': async () => 0,
    'Extensions.getStatusBarItems': async () => [],
  })
  EditorStatusState.set({ column: 7, encoding: 'utf8', languageId: 'javascript', line: 2, tabSize: 4 })

  const result = await loadContent(createDefaultState())

  expect(result.statusBarItemsRight.map((item) => item.name)).toEqual([
    'EditorPosition',
    'EditorIndentation',
    'EditorEncoding',
    'EditorLanguage',
    'Notifications',
  ])
})
