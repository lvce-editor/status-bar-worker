import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleEditorStatusChanged } from '../src/parts/HandleEditorStatusChanged/HandleEditorStatusChanged.ts'

const editorStatus = {
  column: 1,
  encoding: 'utf8',
  endOfLine: 'lf',
  insertSpaces: true,
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
    'EditorEndOfLine',
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
    'EditorEndOfLine',
    'EditorLanguage',
    'Notifications',
  ])
  expect(result.statusBarItemsRight[0].elements).toEqual([{ type: 'text', value: 'Ln 3, Col 8' }])
  expect(result.statusBarItemsRight[1].elements).toEqual([{ type: 'text', value: 'Spaces: 2' }])
  expect(result.statusBarItemsRight[4].elements).toEqual([{ type: 'text', value: 'typescript' }])
})

test('removes editor items when the last editor closes', () => {
  const notification = { ariaLabel: '', elements: [], name: 'Notifications', tooltip: '' }
  const state = handleEditorStatusChanged({ ...createDefaultState(), statusBarItemsRight: [notification] }, editorStatus)

  const result = handleEditorStatusChanged(state, undefined)

  expect(result.statusBarItemsRight).toEqual([notification])
})

test('cursor changes preserve live edits to unrelated editor items', () => {
  const initial = handleEditorStatusChanged(createDefaultState(), editorStatus)
  const edited = {
    ...initial,
    statusBarItemsRight: initial.statusBarItemsRight.map((item) => ({
      ...item,
      elements: [{ type: 'text' as const, value: `custom ${item.name}` }],
    })),
  }
  const result = handleEditorStatusChanged(edited, { ...editorStatus, column: 2 })
  expect(result.statusBarItemsRight[0].elements).toEqual([{ type: 'text', value: 'Ln 1, Col 2' }])
  for (let index = 1; index < 5; index++) {
    expect(result.statusBarItemsRight[index]).toBe(edited.statusBarItemsRight[index])
  }
})

test.each([
  ['column', 7, 'EditorPosition'],
  ['line', 3, 'EditorPosition'],
  ['insertSpaces', false, 'EditorIndentation'],
  ['tabSize', 8, 'EditorIndentation'],
  ['encoding', 'utf16le', 'EditorEncoding'],
  ['endOfLine', 'crlf', 'EditorEndOfLine'],
  ['languageId', 'typescript', 'EditorLanguage'],
])('changing %s replaces only %s dependent item', (key, value, changedName) => {
  const initial = handleEditorStatusChanged(createDefaultState(), editorStatus)
  const edited = {
    ...initial,
    statusBarItemsRight: initial.statusBarItemsRight.map((item) => ({ ...item, elements: [{ type: 'text' as const, value: 'custom' }] })),
  }
  const result = handleEditorStatusChanged(edited, { ...editorStatus, [key]: value })
  for (const [index, item] of result.statusBarItemsRight.entries()) {
    if (item.name === changedName) {
      expect(item).not.toBe(edited.statusBarItemsRight[index])
      expect(item.elements).not.toEqual([{ type: 'text', value: 'custom' }])
    } else {
      expect(item).toBe(edited.statusBarItemsRight[index])
    }
  }
})

test('equal values from another editor preserve the entire state', () => {
  const state = handleEditorStatusChanged(createDefaultState(), editorStatus)
  expect(handleEditorStatusChanged(state, { ...editorStatus })).toBe(state)
})

test('preserves reordered items and unrelated items', () => {
  const initial = handleEditorStatusChanged(createDefaultState(), editorStatus)
  const custom = { ariaLabel: '', elements: [], name: 'custom', tooltip: '' }
  const state = { ...initial, statusBarItemsRight: [custom, ...initial.statusBarItemsRight.toReversed()] }
  const next = handleEditorStatusChanged(state, { ...editorStatus, tabSize: 8 })
  expect(next.statusBarItemsRight.map((item) => item.name)).toEqual(state.statusBarItemsRight.map((item) => item.name))
  expect(next.statusBarItemsRight[0]).toBe(custom)
})
