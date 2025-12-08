import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

export interface StatusBarState {
  readonly statusBarItemsLeft: readonly StatusBarItem[]
  readonly statusBarItemsRight: readonly StatusBarItem[]
  readonly uid: number
}

export { type StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
