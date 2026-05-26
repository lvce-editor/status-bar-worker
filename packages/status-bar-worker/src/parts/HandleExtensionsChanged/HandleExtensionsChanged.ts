import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as GetStatusBarItems from '../GetStatusBarItems/GetStatusBarItems.ts'

export const handleExtensionsChanged = async (state: StatusBarState): Promise<StatusBarState> => {
  const { assetDir, errorCount, platform, warningCount } = state
  // TODO requery status bar items
  const statusBarItems = await GetStatusBarItems.getStatusBarItems({
    assetDir,
    builtinNotificationsEnabled: false,
    builtinProblemsEnabled: false,
    errorCount,
    platform,
    showItems: true,
    warningCount,
  })
  return {
    ...state,
    statusBarItemsLeft: [...statusBarItems],
  }
}
