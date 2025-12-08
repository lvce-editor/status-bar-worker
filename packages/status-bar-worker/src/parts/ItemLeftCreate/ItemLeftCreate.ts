<<<<<<< HEAD
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type * as StatusBarState from '../StatusBarState/StatusBarState.ts'
=======
import type { StatusBarItem, StatusBarState } from '../StatusBarState/StatusBarState.ts'
>>>>>>> origin/main

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
