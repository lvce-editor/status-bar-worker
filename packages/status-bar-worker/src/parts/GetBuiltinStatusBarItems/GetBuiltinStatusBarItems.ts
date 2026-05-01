import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import { getNotificationsStatusBarItem } from '../GetNotificationsStatusBarItem/GetNotificationsStatusBarItem.ts'
import { getProblemsStatusBarItem } from '../GetProblemsStatusBarItem/GetProblemsStatusBarItem.ts'

interface GetBuiltinStatusBarItemsOptions {
  readonly notificationsEnabled?: boolean
  readonly problemsEnabled?: boolean
}

export const getBuiltinStatusBarItems = async (
  errorCount: number,
  warningCount: number,
  { notificationsEnabled = true, problemsEnabled = true }: GetBuiltinStatusBarItemsOptions = {},
): Promise<readonly StatusBarItem[]> => {
  return [...getNotificationsStatusBarItem(notificationsEnabled), ...getProblemsStatusBarItem(errorCount, warningCount, problemsEnabled)]
}
