import { handleExtensionManagementChange } from '../HandleExtensionManagementChange/HandleExtensionManagementChange.ts'
import { handleNotificationCountChangedAll } from '../HandleNotificationCountChangedAll/HandleNotificationCountChangedAll.ts'

export const commandMap = {
  'StatusBar.handleChange': handleExtensionManagementChange,
  'StatusBar.handleNotificationCountChanged': handleNotificationCountChangedAll,
}
