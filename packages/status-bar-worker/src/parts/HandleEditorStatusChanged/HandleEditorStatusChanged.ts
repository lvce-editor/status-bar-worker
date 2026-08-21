import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { getEditorStatusBarItems } from '../GetEditorStatusBarItems/GetEditorStatusBarItems.ts'
import * as InputName from '../InputName/InputName.ts'

const equals = (oldStatus: EditorStatus | undefined, newStatus: EditorStatus | undefined): boolean => {
  if (!oldStatus || !newStatus) {
    return oldStatus === newStatus
  }
  return (
    oldStatus.column === newStatus.column &&
    oldStatus.endOfLine === newStatus.endOfLine &&
    oldStatus.encoding === newStatus.encoding &&
    oldStatus.insertSpaces === newStatus.insertSpaces &&
    oldStatus.languageId === newStatus.languageId &&
    oldStatus.line === newStatus.line &&
    oldStatus.tabSize === newStatus.tabSize
  )
}

const updateItems = (items: readonly StatusBarItem[], status: EditorStatus | undefined): readonly StatusBarItem[] => {
  const remainingItems = items.filter((item) => !InputName.isEditorStatus(item.name))
  const editorItems = getEditorStatusBarItems(status)
  if (editorItems.length === 0) {
    return remainingItems
  }
  const notificationIndex = remainingItems.findIndex((item) => item.name === InputName.Notifications)
  const insertIndex = notificationIndex === -1 ? remainingItems.length : notificationIndex
  return [...remainingItems.slice(0, insertIndex), ...editorItems, ...remainingItems.slice(insertIndex)]
}

export const handleEditorStatusChanged = (state: StatusBarState, editorStatus: EditorStatus | undefined): StatusBarState => {
  const { editorStatus: oldEditorStatus, statusBarItemsRight } = state
  if (equals(oldEditorStatus, editorStatus)) {
    return state
  }
  return {
    ...state,
    editorStatus,
    statusBarItemsRight: updateItems(statusBarItemsRight, editorStatus),
  }
}
