import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const create = (uid: number): StatusBarState => {
  return {
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
}
