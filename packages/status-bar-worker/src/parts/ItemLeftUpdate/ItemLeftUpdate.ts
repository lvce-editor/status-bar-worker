import type * as StatusBarState from '../StatusBarState/StatusBarState.ts'

const updateArray = (
  items: readonly StatusBarState.StatusBarItem[],
  newItem: Readonly<StatusBarState.StatusBarItem>,
): StatusBarState.StatusBarItem[] => {
  const index = getIndex(items, newItem)
  const before = items.slice(0, index)
  const after = items.slice(index + 1)
  return [...before, newItem, ...after]
}

const getIndex = (items: readonly StatusBarState.StatusBarItem[], item: Readonly<StatusBarState.StatusBarItem>): number => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name === item.name) {
      return i
    }
  }
  return -1
}

export const itemLeftUpdate = (
  state: Readonly<StatusBarState.StatusBarState>,
  newItem: Readonly<StatusBarState.StatusBarItem>,
): StatusBarState.StatusBarState => {
  return {
    ...state,
    statusBarItemsLeft: updateArray([...state.statusBarItemsLeft], newItem),
  }
}
