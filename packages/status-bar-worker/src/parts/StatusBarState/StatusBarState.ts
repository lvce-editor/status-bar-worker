export type StatusBarItem = any

export interface StatusBarState {
  readonly statusBarItemsLeft: readonly StatusBarItem[]
  readonly statusBarItemsRight: readonly StatusBarItem[]
  readonly uid: number
}
