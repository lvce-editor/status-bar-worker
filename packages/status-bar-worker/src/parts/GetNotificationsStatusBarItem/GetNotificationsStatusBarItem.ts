import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as InputName from '../InputName/InputName.ts'

const getAriaLabel = (count: number): string => {
  if (count === 0) {
    return 'No Notifications'
  }
  if (count === 1) {
    return '1 Notification'
  }
  return `${count} Notifications`
}

export const getNotificationsStatusBarItem = (enabled: boolean, count = 0): readonly StatusBarItem[] => {
  if (!enabled) {
    return []
  }
  return [
    {
      ariaLabel: getAriaLabel(count),
      command: '',
      elements: [{ type: 'icon', value: 'NotificationBellIcon' }, ...(count > 0 ? [{ type: 'text' as const, value: String(count) }] : [])],
      name: InputName.Notifications,
      tooltip: getAriaLabel(count),
    },
  ]
}
