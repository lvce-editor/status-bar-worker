import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as InputName from '../InputName/InputName.ts'

const getMatchingItem = (itemsLeft: readonly StatusBarItem[], itemsRight: readonly StatusBarItem[], name: string): StatusBarItem | undefined => {
  for (const item of itemsLeft) {
    if (item.name === name) {
      return item
    }
  }
  for (const item of itemsRight) {
    if (item.name === name) {
      return item
    }
  }
  return undefined
}

const handleClickNotification = async (): Promise<void> => {
  // TODO toggle notifications
}

export const handleClick = async (state: StatusBarState, name: string): Promise<StatusBarState> => {
  if (!name) {
    return state
  }
  const { statusBarItemsLeft, statusBarItemsRight } = state

  const item = getMatchingItem(statusBarItemsLeft, statusBarItemsRight, name)
  if (!item) {
    return state
  }
  if (item.name === InputName.Notifications) {
    await handleClickNotification()
  }
  // TODO
  // sendExtensionWorker([/* statusBarItemHandleClick */ 7657, /* name */ name])
  return state
}
