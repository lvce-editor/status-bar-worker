import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as GetStatusBarItems from '../GetStatusBarItems/GetStatusBarItems.ts'
import * as StatusBarPreferences from '../StatusBarPreferences/StatusBarPreferences.ts'

export const loadContent = async (state: StatusBarState): Promise<StatusBarState> => {
  const { assetDir, errorCount, platform, warningCount } = state
  const statusBarItemsPreference = await StatusBarPreferences.itemsVisible()
  const statusBarItems = await GetStatusBarItems.getStatusBarItems({
    assetDir,
    errorCount,
    platform,
    showItems: statusBarItemsPreference,
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
