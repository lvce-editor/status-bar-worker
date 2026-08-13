import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import { getNotificationsStatusBarItem } from '../GetNotificationsStatusBarItem/GetNotificationsStatusBarItem.ts'
import { getProblemsStatusBarItem } from '../GetProblemsStatusBarItem/GetProblemsStatusBarItem.ts'

interface GetBuiltinStatusBarItemsOptions {
  readonly notificationCount?: number
  readonly notificationsEnabled?: boolean
  readonly problemsEnabled?: boolean
}

export const getBuiltinStatusBarItems = async (
  errorCount: number,
  warningCount: number,
  { notificationCount = 0, notificationsEnabled = true, problemsEnabled = true }: GetBuiltinStatusBarItemsOptions = {},
): Promise<readonly StatusBarItem[]> => {
  return [
    ...getNotificationsStatusBarItem(notificationsEnabled, notificationCount),
    ...getProblemsStatusBarItem(errorCount, warningCount, problemsEnabled),
  ]
}
