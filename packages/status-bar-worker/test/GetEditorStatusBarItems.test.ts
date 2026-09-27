import { expect, test } from '@jest/globals'
import { getEditorStatusBarItems } from '../src/parts/GetEditorStatusBarItems/GetEditorStatusBarItems.ts'

test('returns the five editor status items', () => {
  expect(
    getEditorStatusBarItems({
      column: 7,
      encoding: 'utf8',
      endOfLine: 'lf',
      insertSpaces: true,
      languageId: 'javascript',
      line: 2,
      tabSize: 4,
    }),
  ).toEqual([
    expect.objectContaining({
      ariaLabel: 'Line 2, Column 7',
      elements: [{ type: 'text', value: 'Ln 2, Col 7' }],
      name: 'EditorPosition',
      tooltip: 'Go to Line/Column',
    }),
    expect.objectContaining({
      ariaLabel: 'Spaces: 4',
      elements: [{ type: 'text', value: 'Spaces: 4' }],
      name: 'EditorIndentation',
      tooltip: 'Select Indentation',
    }),
    expect.objectContaining({
      ariaLabel: 'Encoding: UTF-8',
      elements: [{ type: 'text', value: ['UTF', '8'].join('-') }],
      name: 'EditorEncoding',
      tooltip: 'Select Encoding',
    }),
    expect.objectContaining({
      ariaLabel: 'End of Line: LF',
      elements: [{ type: 'text', value: 'LF' }],
      name: 'EditorEndOfLine',
      tooltip: 'Select End of Line Sequence',
    }),
    expect.objectContaining({
      ariaLabel: 'Language: javascript',
      elements: [{ type: 'text', value: 'javascript' }],
      name: 'EditorLanguage',
      tooltip: 'Select Language Mode',
    }),
  ])
})

test('shows tab indentation', () => {
  const result = getEditorStatusBarItems({
    column: 1,
    encoding: 'utf8',
    endOfLine: 'crlf',
    insertSpaces: false,
    languageId: 'plaintext',
    line: 1,
    tabSize: 4,
  })

  expect(result[1].elements).toEqual([{ type: 'text', value: 'Tab Size: 4' }])
  expect(result[1].ariaLabel).toBe('Tab Size: 4')
  expect(result[3].elements).toEqual([{ type: 'text', value: 'CRLF' }])
})

test('shows selected character count in the position item', () => {
  const result = getEditorStatusBarItems({
    column: 1,
    encoding: 'utf8',
    endOfLine: 'lf',
    insertSpaces: true,
    languageId: 'plaintext',
    line: 1,
    selectedChars: 12,
    tabSize: 4,
  })

  expect(result[0].elements).toEqual([{ type: 'text', value: 'Ln 1, Col 1 (12 selected)' }])
  expect(result[0].ariaLabel).toBe('Line 1, Column 1, 12 selected')
})

test('returns no items without an active editor', () => {
  expect(getEditorStatusBarItems(undefined)).toEqual([])
})

test('legacy editor snapshots default to spaces and LF', () => {
  const legacyStatus = JSON.parse('{"column":1,"encoding":"utf8","languageId":"plaintext","line":1,"tabSize":2}')
  const items = getEditorStatusBarItems(legacyStatus)
  expect(items[1].elements).toEqual([{ type: 'text', value: 'Spaces: 2' }])
  expect(items[3].elements).toEqual([{ type: 'text', value: 'LF' }])
})
