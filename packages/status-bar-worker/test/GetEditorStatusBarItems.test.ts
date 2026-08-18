import { expect, test } from '@jest/globals'
import { getEditorStatusBarItems } from '../src/parts/GetEditorStatusBarItems/GetEditorStatusBarItems.ts'

test('returns the four editor status items', () => {
  expect(
    getEditorStatusBarItems({
      column: 7,
      encoding: 'utf8',
      languageId: 'javascript',
      line: 2,
      tabSize: 4,
    }),
  ).toEqual([
    expect.objectContaining({ elements: [{ type: 'text', value: 'Ln 2, Col 7' }], name: 'EditorPosition' }),
    expect.objectContaining({ elements: [{ type: 'text', value: 'Spaces: 4' }], name: 'EditorIndentation' }),
    expect.objectContaining({ elements: [{ type: 'text', value: ['UTF', '8'].join('-') }], name: 'EditorEncoding' }),
    expect.objectContaining({ elements: [{ type: 'text', value: 'javascript' }], name: 'EditorLanguage' }),
  ])
})

test('returns no items without an active editor', () => {
  expect(getEditorStatusBarItems(undefined)).toEqual([])
})
