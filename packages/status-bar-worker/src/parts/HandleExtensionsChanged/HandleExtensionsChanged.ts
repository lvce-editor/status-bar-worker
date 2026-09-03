import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as GetStatusBarItems from '../GetStatusBarItems/GetStatusBarItems.ts'

const refreshVersions: Record<number, number> = Object.create(null)

export const handleExtensionsChanged = async (state: StatusBarState): Promise<StatusBarState> => {
  const { assetDir, errorCount, platform, uid, warningCount } = state
  const refreshVersion = (refreshVersions[uid] || 0) + 1
  refreshVersions[uid] = refreshVersion
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
  if (refreshVersions[uid] !== refreshVersion) {
    return state
  }
  return {
    ...state,
    statusBarItemsLeft: [...statusBarItems],
  }
}
