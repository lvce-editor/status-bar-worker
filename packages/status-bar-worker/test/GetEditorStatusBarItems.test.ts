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
    expect.objectContaining({ elements: [{ type: 'text', value: 'Ln 2, Col 7' }], name: 'EditorPosition' }),
    expect.objectContaining({ elements: [{ type: 'text', value: 'Spaces: 4' }], name: 'EditorIndentation' }),
    expect.objectContaining({ elements: [{ type: 'text', value: ['UTF', '8'].join('-') }], name: 'EditorEncoding' }),
    expect.objectContaining({ elements: [{ type: 'text', value: 'LF' }], name: 'EditorEndOfLine' }),
    expect.objectContaining({ elements: [{ type: 'text', value: 'javascript' }], name: 'EditorLanguage' }),
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
  expect(result[3].elements).toEqual([{ type: 'text', value: 'CRLF' }])
})

test('returns no items without an active editor', () => {
  expect(getEditorStatusBarItems(undefined)).toEqual([])
})
