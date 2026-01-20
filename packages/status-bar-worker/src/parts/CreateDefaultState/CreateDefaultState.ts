import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const createDefaultState = (): StatusBarState => {
  return {
    assetDir: '',
    errorCount: 0,
    platform: 0,
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid: 0,
    warningCount: 0,
  }
}
