import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { getNotificationsStatusBarItem } from '../GetNotificationsStatusBarItem/GetNotificationsStatusBarItem.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleNotificationCountChanged = (state: StatusBarState, count: number): StatusBarState => {
  const { statusBarItemsRight } = state
  const notificationsEnabled = statusBarItemsRight.some((item) => item.name === InputName.Notifications)
  if (!notificationsEnabled) {
    return state
  }
  return {
    ...state,
    statusBarItemsRight: getNotificationsStatusBarItem(true, count),
  }
}
