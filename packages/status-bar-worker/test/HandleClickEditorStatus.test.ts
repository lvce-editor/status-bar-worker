import { expect, test } from '@jest/globals'
import type { EditorStatus } from '../src/parts/EditorStatus/EditorStatus.ts'
import * as HandleClickEditorStatus from '../src/parts/HandleClickEditorStatus/HandleClickEditorStatus.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'
import * as QuickPickWorker from '../src/parts/QuickPickWorker/QuickPickWorker.ts'

const status: EditorStatus = {
  column: 5,
  encoding: 'utf8',
  endOfLine: 'lf',
  insertSpaces: true,
  languageId: 'typescript',
  line: 3,
  tabSize: 2,
}

test.each([
  [InputName.EditorEndOfLine, ['end-of-line']],
  [InputName.EditorIndentation, ['indentation']],
  [InputName.EditorLanguage, ['language-mode']],
  [InputName.EditorPosition, ['go-to-line', 3, 5]],
])('opens the quick pick for %s', async (name, args) => {
  using quickPickWorker = QuickPickWorker.registerMockRpc({
    'QuickPick.openStatusBarPicker': async () => {},
  })

  await HandleClickEditorStatus.handleClickEditorStatus(name, status)

  expect(quickPickWorker.invocations).toEqual([['QuickPick.openStatusBarPicker', ...args]])
})

test('does not open a quick pick when editor status is absent', async () => {
  using quickPickWorker = QuickPickWorker.registerMockRpc({
    'QuickPick.openStatusBarPicker': async () => {},
  })

  await HandleClickEditorStatus.handleClickEditorStatus(InputName.EditorPosition, undefined)

  expect(quickPickWorker.invocations).toEqual([])
})

test('ignores unrecognized status bar inputs', async () => {
  using quickPickWorker = QuickPickWorker.registerMockRpc({
    'QuickPick.openStatusBarPicker': async () => {},
  })

  await HandleClickEditorStatus.handleClickEditorStatus('unknown', status)

  expect(quickPickWorker.invocations).toEqual([])
})
