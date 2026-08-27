import { afterEach, expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as EditorStatusState from '../src/parts/EditorStatusState/EditorStatusState.ts'
import { handleEditorStatusChangedAll } from '../src/parts/HandleEditorStatusChangedAll/HandleEditorStatusChangedAll.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

const editorStatus = { column: 7, encoding: 'utf8', endOfLine: 'lf', insertSpaces: true, languageId: 'javascript', line: 2, tabSize: 4 }

afterEach(() => {
  EditorStatusState.reset()
})

test('retains editor status changes before a status bar instance exists', async () => {
  await handleEditorStatusChangedAll(editorStatus)

  expect(EditorStatusState.get()).toEqual(editorStatus)
})

test('renders editor status changes through the direct renderer connection', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 17)
  const sendMultiple = jest.fn()
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands, 'Viewlet.sendMultiple': sendMultiple } }))
  const notification = { ariaLabel: '', elements: [], name: 'Notifications', tooltip: '' }
  const state = { ...createDefaultState(), initial: false, statusBarItemsRight: [notification], uid: 43 }
  StatusBarStates.set(43, state, state)

  await handleEditorStatusChangedAll(editorStatus)

  expect(queueCommands).toHaveBeenCalledTimes(1)
  const [uid, commands] = queueCommands.mock.calls[0]
  expect(uid).toBe(43)
  expect(JSON.stringify(commands)).toContain('Ln 2, Col 7')
  expect(sendMultiple).toHaveBeenCalledWith([['Viewlet.commitPending', 43, 17]])
})
