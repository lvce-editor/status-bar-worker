import type { GetStatusBarItemsOptions } from '../GetStatusBarItemsOptions/GetStatusBarItemsOptions.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.ts'
import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.ts'
import { getBuiltinStatusBarItems } from '../GetBuiltinStatusBarItems/GetBuiltinStatusBarItems.ts'
import * as ToStatusBarItem from '../ToStatusBarItem/ToStatusBarItem.ts'
import * as ToUiStatusBarItems from '../ToUiStatusBarItems/ToUiStatusBarItems.ts'

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
  await ExtensionHostManagement.activateByEvent('onStatusBarItem', assetDir, platform)
  await ExtensionHostManagement.activateByEvent('onSourceControl', assetDir, platform)
  const extensionStatusBarItems = await ExtensionHostStatusBarItems.getStatusBarItems(assetDir, platform)
  const uiStatusBarItems = ToUiStatusBarItems.toUiStatusBarItems(extensionStatusBarItems)
  const extraItems = await getBuiltinStatusBarItems(errorCount, warningCount, {
    notificationsEnabled: builtinNotificationsEnabled,
    problemsEnabled: builtinProblemsEnabled,
  })
  return [...uiStatusBarItems.map(ToStatusBarItem.toStatusBarItem), ...extraItems]
}
