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

export { handleClick } from '../HandleClick/HandleClick.ts'
export { itemLeftUpdate } from '../ItemLeftUpdate/ItemLeftUpdate.ts'
export { itemRightCreate } from '../ItemRightCreate/ItemRightCreate.ts'
export { itemRightUpdate } from '../ItemRightUpdate/ItemRightUpdate.ts'
