import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleEditorStatusChangedAll } from '../src/parts/HandleEditorStatusChangedAll/HandleEditorStatusChangedAll.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

const status = { column: 1, encoding: 'utf8', endOfLine: 'lf', insertSpaces: true, languageId: 'json', line: 1, tabSize: 2 }

test('an extension refresh cannot overwrite editor status received while awaiting items', async () => {
  const started = Promise.withResolvers<void>()
  const items = Promise.withResolvers<readonly unknown[]>()
  using _extensionRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getNotificationCount': async () => 0,
    'Extensions.getStatusBarItems': async () => {
      started.resolve()
      return items.promise
    },
  })
  const initial = { ...createDefaultState(), uid: 801 }
  StatusBarStates.set(801, initial, initial)
  const pending = commandMap['StatusBar.handleItemsChanged'](801)
  await started.promise
  await handleEditorStatusChangedAll(status)
  const editorItems = StatusBarStates.get(801).newState.statusBarItemsRight
  expect(editorItems).toHaveLength(5)
  items.resolve([])
  await pending
  expect(StatusBarStates.get(801).newState.statusBarItemsRight).toBe(editorItems)
})
