import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const createDefaultState = (): StatusBarState => {
  return {
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid: 0,
  }
}
