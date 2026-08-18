import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleEditorStatusChanged } from '../src/parts/HandleEditorStatusChanged/HandleEditorStatusChanged.ts'

const editorStatus = {
  column: 1,
  encoding: 'utf8',
  languageId: 'plaintext',
  line: 1,
  tabSize: 4,
}

test('adds editor items before notifications', () => {
  const notification = { ariaLabel: '', elements: [], name: 'Notifications', tooltip: '' }
  const state = { ...createDefaultState(), statusBarItemsRight: [notification] }

  const result = handleEditorStatusChanged(state, editorStatus)

  expect(result.statusBarItemsRight.map((item) => item.name)).toEqual([
    'EditorPosition',
    'EditorIndentation',
    'EditorEncoding',
    'EditorLanguage',
    'Notifications',
  ])
})

test('updates editor values and preserves other right items', () => {
  const notification = { ariaLabel: '', elements: [], name: 'Notifications', tooltip: '' }
  const state = handleEditorStatusChanged({ ...createDefaultState(), statusBarItemsRight: [notification] }, editorStatus)

  const result = handleEditorStatusChanged(state, { ...editorStatus, column: 8, languageId: 'typescript', line: 3, tabSize: 2 })

  expect(result.statusBarItemsRight.map((item) => item.name)).toEqual([
    'EditorPosition',
    'EditorIndentation',
    'EditorEncoding',
    'EditorLanguage',
    'Notifications',
  ])
  expect(result.statusBarItemsRight[0].elements).toEqual([{ type: 'text', value: 'Ln 3, Col 8' }])
  expect(result.statusBarItemsRight[1].elements).toEqual([{ type: 'text', value: 'Spaces: 2' }])
  expect(result.statusBarItemsRight[3].elements).toEqual([{ type: 'text', value: 'typescript' }])
})

test('removes editor items when the last editor closes', () => {
  const notification = { ariaLabel: '', elements: [], name: 'Notifications', tooltip: '' }
  const state = handleEditorStatusChanged({ ...createDefaultState(), statusBarItemsRight: [notification] }, editorStatus)

  const result = handleEditorStatusChanged(state, undefined)

  expect(result.statusBarItemsRight).toEqual([notification])
})
