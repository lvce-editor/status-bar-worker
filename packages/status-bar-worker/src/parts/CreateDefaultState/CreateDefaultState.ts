import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const createDefaultState = (): StatusBarState => {
  return {
    assetDir,
    platform,
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid: 0,
  }
}
