import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { getNotificationsStatusBarItem } from '../GetNotificationsStatusBarItem/GetNotificationsStatusBarItem.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleNotificationCountChanged = (state: StatusBarState, count: number): StatusBarState => {
  const { statusBarItemsRight } = state
  const notificationsEnabled = statusBarItemsRight.some((item) => item.name === InputName.Notifications)
  if (!notificationsEnabled) {
    return state
  }
  const [notificationItem] = getNotificationsStatusBarItem(true, count)
  if (!notificationItem) {
    return state
  }
  return {
    ...state,
    statusBarItemsRight: statusBarItemsRight.map((item) => (item.name === InputName.Notifications ? notificationItem : item)),
  }
}
