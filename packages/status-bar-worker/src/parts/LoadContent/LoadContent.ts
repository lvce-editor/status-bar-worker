import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as GetStatusBarItems from '../GetStatusBarItems/GetStatusBarItems.ts'
import * as StatusBarPreferences from '../StatusBarPreferences/StatusBarPreferences.ts'

export const loadContent = async (state: StatusBarState): Promise<StatusBarState> => {
  const { assetDir, errorCount, platform, warningCount } = state
  const statusBarPreferences = await StatusBarPreferences.loadStatusBarPreferences()
  const statusBarItems = await GetStatusBarItems.getStatusBarItems({
    assetDir,
    builtinNotificationsEnabled: statusBarPreferences.builtinNotificationsEnabled,
    builtinProblemsEnabled: statusBarPreferences.builtinProblemsEnabled,
    errorCount,
    platform,
    showItems: statusBarPreferences.itemsVisible,
    warningCount,
  })
  return {
    ...state,
    errorCount: 0,
    initial: false,
    statusBarItemsLeft: [...statusBarItems],
    statusBarItemsRight: [],
    warningCount: 0,
  }
}
