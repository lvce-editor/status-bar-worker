export const EditorEncoding = 'EditorEncoding'
export const EditorEndOfLine = 'EditorEndOfLine'
export const EditorIndentation = 'EditorIndentation'
export const EditorLanguage = 'EditorLanguage'
export const EditorPosition = 'EditorPosition'
export const Notifications = 'Notifications'
export const Problems = 'Problems'

export const isEditorStatus = (name: string): boolean => {
  return [EditorEncoding, EditorEndOfLine, EditorIndentation, EditorLanguage, EditorPosition].includes(name)
}

export const isRight = (name: string): boolean => {
  return name === Notifications || isEditorStatus(name)
}
