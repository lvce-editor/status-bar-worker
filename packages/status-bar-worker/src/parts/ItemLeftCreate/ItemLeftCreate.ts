import type { StatusBarItem, StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const itemLeftCreate = (state: StatusBarState, name: string, text: string, tooltip: string): StatusBarState => {
  const { statusBarItemsLeft } = state
  const newItem: StatusBarItem = {
    name,
    text,
    tooltip,
  }
  const newStatusBarItemsLeft = [...statusBarItemsLeft, newItem]
  return {
    ...state,
    statusBarItemsLeft: newStatusBarItemsLeft,
  }
}
