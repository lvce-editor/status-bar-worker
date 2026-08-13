import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { GetStatusBarItemsOptions } from '../GetStatusBarItemsOptions/GetStatusBarItemsOptions.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import { getBuiltinStatusBarItems } from '../GetBuiltinStatusBarItems/GetBuiltinStatusBarItems.ts'
import { getExtensionStatusBarItems } from '../GetExtensionStatusBarItems/GetExtensionStatusBarItems.ts'
import * as ToStatusBarItem from '../ToStatusBarItem/ToStatusBarItem.ts'
import * as ToUiStatusBarItems from '../ToUiStatusBarItems/ToUiStatusBarItems.ts'

const getNotificationCount = async (): Promise<number> => {
  try {
    return await ExtensionManagementWorker.invoke('Extensions.getNotificationCount')
  } catch {
    return 0
  }
}

export const getStatusBarItems = async ({
  assetDir,
  builtinNotificationsEnabled = true,
  builtinProblemsEnabled = true,
  errorCount,
  platform,
  showItems,
  warningCount,
}: GetStatusBarItemsOptions): Promise<readonly StatusBarItem[]> => {
  if (!showItems) {
    return []
  }
  const extensionStatusBarItems = await getExtensionStatusBarItems(assetDir, platform)
  const notificationCount = await getNotificationCount()
  const uiStatusBarItems = ToUiStatusBarItems.toUiStatusBarItems(extensionStatusBarItems)
  const extraItems = await getBuiltinStatusBarItems(errorCount, warningCount, {
    notificationCount,
    notificationsEnabled: builtinNotificationsEnabled,
    problemsEnabled: builtinProblemsEnabled,
  })
  return [...uiStatusBarItems.map(ToStatusBarItem.toStatusBarItem), ...extraItems]
}
