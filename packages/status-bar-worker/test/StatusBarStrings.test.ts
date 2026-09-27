import { expect, test } from '@jest/globals'
import * as I18NString from '../src/parts/I18NString/I18NString.ts'
import * as StatusBarStrings from '../src/parts/StatusBarStrings/StatusBarStrings.ts'
import * as UiStrings from '../src/parts/UiStrings/UiStrings.ts'

test('interpolates numeric values into translatable status bar strings', () => {
  expect(StatusBarStrings.editorPositionWithSelection(12, 34, 56)).toBe('Ln 12, Col 34 (56 selected)')
  expect(StatusBarStrings.editorIndentationSpaces(8)).toBe('Spaces: 8')
  expect(StatusBarStrings.editorEncoding(['UTF', '8'].join('-'))).toBe('Encoding: UTF-8')
})

test('supports translated templates that reorder placeholders', () => {
  expect(I18NString.i18nString('Column {PH2}, line {PH1}', { PH1: 12, PH2: 34 })).toBe('Column 34, line 12')
  expect(I18NString.i18nString(UiStrings.EditorPositionWithSelectionAriaLabel, { PH1: 12, PH2: 34, PH3: 56 })).toBe('Line 12, Column 34, 56 selected')
})
