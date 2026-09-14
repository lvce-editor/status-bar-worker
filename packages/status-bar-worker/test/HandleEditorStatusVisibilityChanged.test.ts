import { afterEach, expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as EditorStatusState from '../src/parts/EditorStatusState/EditorStatusState.ts'
import * as EditorStatusVisibilityState from '../src/parts/EditorStatusVisibilityState/EditorStatusVisibilityState.ts'
import { getEditorStatusBarItems } from '../src/parts/GetEditorStatusBarItems/GetEditorStatusBarItems.ts'
import { handleEditorStatusChangedAll } from '../src/parts/HandleEditorStatusChangedAll/HandleEditorStatusChangedAll.ts'
import { handleEditorStatusVisibilityChanged } from '../src/parts/HandleEditorStatusVisibilityChanged/HandleEditorStatusVisibilityChanged.ts'
import { handleEditorStatusVisibilityChangedAll } from '../src/parts/HandleEditorStatusVisibilityChangedAll/HandleEditorStatusVisibilityChangedAll.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

const editorStatus = {
  column: 7,
  encoding: 'utf8',
  endOfLine: 'lf',
  insertSpaces: true,
  languageId: 'javascript',
  line: 2,
  tabSize: 4,
}

afterEach(() => {
  EditorStatusState.reset()
  EditorStatusVisibilityState.reset()
})

test('hides editor status items without discarding the cached status', async () => {
  await handleEditorStatusChangedAll(editorStatus)
  const state = handleEditorStatusVisibilityChanged(
    {
      ...createDefaultState(),
      editorStatus,
      initial: false,
      statusBarItemsRight: [
        { ariaLabel: '', elements: [], name: 'EditorPosition', tooltip: '' },
        { ariaLabel: '', elements: [], name: 'custom', tooltip: '' },
        { ariaLabel: '', elements: [], name: 'EditorLanguage', tooltip: '' },
      ],
    },
    false,
  )

  expect(state.editorStatus).toEqual(editorStatus)
  expect(state.statusBarItemsRight).toEqual([expect.objectContaining({ name: 'custom' })])
})

test('restores cached editor status items when a text editor becomes active', async () => {
  await handleEditorStatusChangedAll(editorStatus)
  const hiddenState = handleEditorStatusVisibilityChanged(
    {
      ...createDefaultState(),
      editorStatus,
      initial: false,
      statusBarItemsRight: [{ ariaLabel: '', elements: [], name: 'custom', tooltip: '' }],
    },
    false,
  )

  const state = handleEditorStatusVisibilityChanged(hiddenState, true)

  expect(state.statusBarItemsRight.map((item) => item.name)).toEqual([
    'custom',
    'EditorPosition',
    'EditorIndentation',
    'EditorEncoding',
    'EditorEndOfLine',
    'EditorLanguage',
  ])
})

test('updates all loaded status bars and keeps late status updates hidden', async () => {
  const uid = 904
  await handleEditorStatusChangedAll(editorStatus)
  const state = {
    ...createDefaultState(),
    editorStatus,
    initial: false,
    statusBarItemsRight: [...getEditorStatusBarItems(editorStatus), { ariaLabel: '', elements: [], name: 'custom', tooltip: '' }],
    uid,
  }
  StatusBarStates.set(uid, state, state)

  await handleEditorStatusVisibilityChangedAll(false)
  await handleEditorStatusChangedAll({ column: 8 })
  expect(StatusBarStates.get(uid).newState.statusBarItemsRight).toEqual([expect.objectContaining({ name: 'custom' })])

  await handleEditorStatusVisibilityChangedAll(true)
  expect(StatusBarStates.get(uid).newState.statusBarItemsRight.find((item) => item.name === 'EditorPosition')).toEqual(
    expect.objectContaining({ elements: [{ type: 'text', value: 'Ln 2, Col 8' }] }),
  )
})
