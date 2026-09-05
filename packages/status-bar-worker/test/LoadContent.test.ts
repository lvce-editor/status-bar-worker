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
  EditorStatusState.set({ column: 7, encoding: 'utf8', endOfLine: 'lf', insertSpaces: true, languageId: 'javascript', line: 2, tabSize: 4 })

  const result = await loadContent(createDefaultState())

  expect(result.statusBarItemsRight.map((item) => item.name)).toEqual([
    'EditorPosition',
    'EditorIndentation',
    'EditorEncoding',
    'EditorEndOfLine',
    'EditorLanguage',
    'Notifications',
  ])
})

test('uses the latest editor status when loading finishes', async () => {
  const initial = { column: 1, encoding: 'utf8', endOfLine: 'lf', insertSpaces: true, languageId: 'javascript', line: 1, tabSize: 4 }
  using _rendererWorkerRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => undefined,
  })
  using _extensionManagementWorkerRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getNotificationCount': async () => {
      EditorStatusState.applyUpdate({ column: 9 })
      return 0
    },
    'Extensions.getStatusBarItems': async () => [],
  })
  EditorStatusState.set(initial)

  const result = await loadContent(createDefaultState())

  expect(result.editorStatus).toEqual({ ...initial, column: 9 })
  expect(result.statusBarItemsRight[0].elements).toEqual([{ type: 'text', value: 'Ln 1, Col 9' }])
})
