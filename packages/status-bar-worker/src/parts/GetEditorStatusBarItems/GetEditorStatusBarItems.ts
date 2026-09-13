import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as InputName from '../InputName/InputName.ts'

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
  const indentationLabel = insertSpaces ? `Spaces: ${tabSize}` : `Tab Size: ${tabSize}`
  const endOfLineLabel = endOfLine.toUpperCase()
  const positionLabel = selectedChars > 0 ? `Ln ${line}, Col ${column} (${selectedChars} selected)` : `Ln ${line}, Col ${column}`
  const positionAriaLabel = selectedChars > 0 ? `Line ${line}, Column ${column}, ${selectedChars} selected` : `Line ${line}, Column ${column}`
  return [
    textItem(InputName.EditorPosition, positionLabel, positionAriaLabel, 'Go to Line/Column'),
    textItem(InputName.EditorIndentation, indentationLabel, indentationLabel, 'Select Indentation'),
    textItem(InputName.EditorEncoding, encodingLabel, `Encoding: ${encodingLabel}`, 'Select Encoding'),
    textItem(InputName.EditorEndOfLine, endOfLineLabel, `End of Line: ${endOfLineLabel}`, 'Select End of Line Sequence'),
    textItem(InputName.EditorLanguage, languageId, `Language: ${languageId}`, 'Select Language Mode'),
  ]
}
