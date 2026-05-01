import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as InputName from '../InputName/InputName.ts'

export const getNotificationsStatusBarItem = (): StatusBarItem => {
  return {
    ariaLabel: 'Notifications',
    command: '', // TODO should show notifications center
    elements: [{ type: 'text', value: 'Notifications' }],
    name: InputName.Notifications,
    tooltip: 'Notifications',
  }
}
