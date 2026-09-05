import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { getEditorStatusBarItems } from '../GetEditorStatusBarItems/GetEditorStatusBarItems.ts'
import * as InputName from '../InputName/InputName.ts'

const dependencies: Readonly<Record<string, readonly (keyof EditorStatus)[]>> = {
  [InputName.EditorEncoding]: ['encoding'],
  [InputName.EditorEndOfLine]: ['endOfLine'],
  [InputName.EditorIndentation]: ['insertSpaces', 'tabSize'],
  [InputName.EditorLanguage]: ['languageId'],
  [InputName.EditorPosition]: ['line', 'column'],
}

export const handleEditorStatusChanged = (
  state: StatusBarState,
  editorStatus: EditorStatus | undefined,
  previous: { readonly editorStatus: EditorStatus | undefined } = state,
): StatusBarState => {
  const { statusBarItemsRight } = state
  const oldStatus = previous.editorStatus
  if (!editorStatus) {
    if (!oldStatus) {
      return state
    }
    return { ...state, editorStatus, statusBarItemsRight: statusBarItemsRight.filter((item) => !InputName.isEditorStatus(item.name)) }
  }
  const replacements = new Map<string, StatusBarItem>()
  for (const item of getEditorStatusBarItems(editorStatus)) {
    if (!oldStatus || dependencies[item.name].some((key) => oldStatus[key] !== editorStatus[key])) {
      replacements.set(item.name, item)
    }
  }
  if (replacements.size === 0) {
    return state
  }
  const updatedItems = statusBarItemsRight.map((item) => {
    const replacement = replacements.get(item.name)
    replacements.delete(item.name)
    return replacement || item
  })
  const notificationIndex = updatedItems.findIndex((item) => item.name === InputName.Notifications)
  updatedItems.splice(notificationIndex === -1 ? updatedItems.length : notificationIndex, 0, ...replacements.values())
  return { ...state, editorStatus, statusBarItemsRight: updatedItems }
}
