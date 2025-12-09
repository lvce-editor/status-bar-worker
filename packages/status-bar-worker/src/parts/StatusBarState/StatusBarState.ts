import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

export interface StatusBarState {
  readonly disposed?: boolean
  readonly statusBarItemsLeft: readonly StatusBarItem[]
  readonly statusBarItemsRight: readonly StatusBarItem[]
  readonly uid: number
}
