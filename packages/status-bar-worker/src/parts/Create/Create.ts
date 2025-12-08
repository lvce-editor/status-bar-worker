import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const create = (): StatusBarState => {
  return {
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
  }
}
