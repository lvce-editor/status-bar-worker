import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type * as StatusBarState from '../StatusBarState/StatusBarState.ts'

export const itemLeftCreate = (
  state: Readonly<StatusBarState.StatusBarState>,
  name: string,
  text: string,
  tooltip: string,
): StatusBarState.StatusBarState => {
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
