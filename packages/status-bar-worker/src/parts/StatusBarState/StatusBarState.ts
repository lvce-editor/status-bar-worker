import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

export interface StatusBarState {
  readonly statusBarItemsLeft: readonly StatusBarItem[]
  readonly statusBarItemsRight: readonly StatusBarItem[]
}

export { type StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
