import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type * as StatusBarState from '../StatusBarState/StatusBarState.ts'
import * as GetStatusBarItems from '../GetStatusBarItems/GetStatusBarItems.ts'
import * as StatusBarPreferences from '../StatusBarPreferences/StatusBarPreferences.ts'

type State = StatusBarState.StatusBarState & {
  disposed?: boolean
}

export const loadContent = async (state: Readonly<State>): Promise<State> => {
  const statusBarItemsPreference = await StatusBarPreferences.itemsVisible()
  const statusBarItems = await GetStatusBarItems.getStatusBarItems(statusBarItemsPreference)
  return {
    ...state,
    statusBarItemsLeft: [...statusBarItems],
  }
}

const updateArray = (items: readonly StatusBarItem[], newItem: Readonly<StatusBarItem>): StatusBarItem[] => {
  const index = getIndex(items, newItem)
  const before = items.slice(0, index)
  const after = items.slice(index + 1)
  return [...before, newItem, ...after]
}

const getIndex = (items: readonly StatusBarItem[], item: Readonly<StatusBarItem>): number => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name === item.name) {
      return i
    }
  }
  return -1
}

export { handleClick } from '../HandleClick/HandleClick.ts'
export { itemLeftUpdate } from '../ItemLeftUpdate/ItemLeftUpdate.ts'
export { itemRightCreate } from '../ItemRightCreate/ItemRightCreate.ts'
export { itemRightUpdate } from '../ItemRightUpdate/ItemRightUpdate.ts'
