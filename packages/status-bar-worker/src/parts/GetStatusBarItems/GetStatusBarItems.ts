import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.ts'
import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.ts'
import { getBuiltinStatusBarItems } from '../GetBuiltinStatusBarItems/GetBuiltinStatusBarItems.ts'
import * as StatusBarPreferences from '../StatusBarPreferences/StatusBarPreferences.ts'
import * as ToStatusBarItem from '../ToStatusBarItem/ToStatusBarItem.ts'
import * as ToUiStatusBarItems from '../ToUiStatusBarItems/ToUiStatusBarItems.ts'

export interface GetStatusBarItemsOptions {
  readonly assetDir: string
  readonly errorCount: number
  readonly platform: number
  readonly showItems: boolean
  readonly warningCount: number
}

export const getStatusBarItems = async ({
  assetDir,
  errorCount,
  platform,
  showItems,
  warningCount,
}: GetStatusBarItemsOptions): Promise<readonly StatusBarItem[]> => {
  if (!showItems) {
    return []
  }
  const [notificationsEnabled, problemsEnabled] = await Promise.all([
    StatusBarPreferences.builtinNotificationsEnabled(),
    StatusBarPreferences.builtinProblemsEnabled(),
  ])
  await ExtensionHostManagement.activateByEvent('onSourceControl', assetDir, platform)
  const extensionStatusBarItems = await ExtensionHostStatusBarItems.getStatusBarItems(assetDir, platform)
  const uiStatusBarItems = ToUiStatusBarItems.toUiStatusBarItems(extensionStatusBarItems)
  const extraItems = await getBuiltinStatusBarItems(errorCount, warningCount, {
    notificationsEnabled,
    problemsEnabled,
  })
  return [...uiStatusBarItems.map(ToStatusBarItem.toStatusBarItem), ...extraItems]
}
