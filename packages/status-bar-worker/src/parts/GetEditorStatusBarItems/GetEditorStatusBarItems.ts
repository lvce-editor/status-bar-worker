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
  const { column, encoding, languageId, line, tabSize } = status
  const encodingLabel = encoding === 'utf8' ? ['UTF', '8'].join('-') : encoding
  return [
    textItem(InputName.EditorPosition, `Ln ${line}, Col ${column}`, `Line ${line}, Column ${column}`, 'Go to Line/Column'),
    textItem(InputName.EditorIndentation, `Spaces: ${tabSize}`, `Spaces: ${tabSize}`, 'Select Indentation'),
    textItem(InputName.EditorEncoding, encodingLabel, `Encoding: ${encodingLabel}`, 'Select Encoding'),
    textItem(InputName.EditorLanguage, languageId, `Language: ${languageId}`, 'Select Language Mode'),
  ]
}
