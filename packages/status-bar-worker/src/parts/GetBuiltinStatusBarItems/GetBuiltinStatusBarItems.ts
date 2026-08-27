import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import { getEditorStatusBarItems } from '../GetEditorStatusBarItems/GetEditorStatusBarItems.ts'
import { getNotificationsStatusBarItem } from '../GetNotificationsStatusBarItem/GetNotificationsStatusBarItem.ts'
import { getProblemsStatusBarItem } from '../GetProblemsStatusBarItem/GetProblemsStatusBarItem.ts'

interface GetBuiltinStatusBarItemsOptions {
  readonly editorStatus?: EditorStatus
  readonly notificationCount?: number
  readonly notificationsEnabled?: boolean
  readonly problemsEnabled?: boolean
}

export const getBuiltinStatusBarItems = async (
  errorCount: number,
  warningCount: number,
  { editorStatus, notificationCount = 0, notificationsEnabled = true, problemsEnabled = true }: GetBuiltinStatusBarItemsOptions = {},
): Promise<readonly StatusBarItem[]> => {
  return [
    ...getEditorStatusBarItems(editorStatus),
    ...getNotificationsStatusBarItem(notificationsEnabled, notificationCount),
    ...getProblemsStatusBarItem(errorCount, warningCount, problemsEnabled),
  ]
}
