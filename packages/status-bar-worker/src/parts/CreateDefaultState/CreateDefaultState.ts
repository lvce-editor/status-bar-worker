import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const createDefaultState = (): StatusBarState => {
  return {
    assetDir: '',
    errorCount: 0,
    initial: true,
    platform: 0,
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid: 0,
    visibleStatusBarItemsLeft: [],
    visibleStatusBarItemsRight: [],
    warningCount: 0,
    width: 1024,
  }
}
