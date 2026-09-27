import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as InputName from '../InputName/InputName.ts'
import * as StatusBarStrings from '../StatusBarStrings/StatusBarStrings.ts'

const textItem = (name: string, text: string, ariaLabel: string, tooltip: string): StatusBarItem => ({
  ariaLabel,
  command: '',
  elements: [{ type: 'text', value: text }],
  name,
  tooltip,
})

export const getEditorStatusBarItems = (status: EditorStatus | undefined): readonly StatusBarItem[] => {
  if (!status) {
    return []
  }
  const { column, encoding, endOfLine = 'lf', insertSpaces = true, languageId, line, selectedChars = 0, tabSize } = status
  const encodingLabel = encoding === 'utf8' ? ['UTF', '8'].join('-') : encoding
  const indentationLabel = insertSpaces ? StatusBarStrings.editorIndentationSpaces(tabSize) : StatusBarStrings.editorIndentationTabs(tabSize)
  const endOfLineLabel = endOfLine.toUpperCase()
  const positionLabel =
    selectedChars > 0 ? StatusBarStrings.editorPositionWithSelection(line, column, selectedChars) : StatusBarStrings.editorPosition(line, column)
  const positionAriaLabel =
    selectedChars > 0
      ? StatusBarStrings.editorPositionWithSelectionAriaLabel(line, column, selectedChars)
      : StatusBarStrings.editorPositionAriaLabel(line, column)
  return [
    textItem(InputName.EditorPosition, positionLabel, positionAriaLabel, StatusBarStrings.goToLineColumn()),
    textItem(InputName.EditorIndentation, indentationLabel, indentationLabel, StatusBarStrings.selectIndentation()),
    textItem(InputName.EditorEncoding, encodingLabel, StatusBarStrings.editorEncoding(encodingLabel), StatusBarStrings.selectEncoding()),
    textItem(InputName.EditorEndOfLine, endOfLineLabel, StatusBarStrings.editorEndOfLine(endOfLineLabel), StatusBarStrings.selectEndOfLineSequence()),
    textItem(InputName.EditorLanguage, languageId, StatusBarStrings.editorLanguage(languageId), StatusBarStrings.selectLanguageMode()),
  ]
}
