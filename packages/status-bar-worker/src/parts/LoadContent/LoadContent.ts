import type * as StatusBarState from '../StatusBarState/StatusBarState.ts'
import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.ts'
import * as GetStatusBarItems from '../GetStatusBarItems/GetStatusBarItems.ts'
import * as StatusBarPreferences from '../StatusBarPreferences/StatusBarPreferences.ts'

type State = StatusBarState.StatusBarState & {
  disposed?: boolean
}

type StatusBarItem = {
  readonly command?: string
  readonly icon?: string
  readonly name: string
  readonly text: string
  readonly tooltip: string
}

export const loadContent = async (state: Readonly<State>): Promise<State> => {
  const statusBarItemsPreference = StatusBarPreferences.itemsVisible()
  const statusBarItems = await GetStatusBarItems.getStatusBarItems(statusBarItemsPreference)
  return {
    ...state,
    statusBarItemsLeft: [...statusBarItems],
  }
}

export const updateStatusBarItems = async (state: Readonly<State>): Promise<State> => {
  const newState = await loadContent(state)
  return newState
}

export const contentLoadedEffects = (state: Readonly<State>): void => {
  // TODO dispose listener
  const handleChange = async (): Promise<void> => {
    if (state.disposed) {
      return
    }
    await updateStatusBarItems(state)
  }
  // maybe return cleanup function from here like react hooks
  void ExtensionHostStatusBarItems.onChange(handleChange)
}

const updateArray = (items: readonly StatusBarItem[], newItem: Readonly<StatusBarItem>): StatusBarItem[] => {
  const index = getIndex(items, newItem)
  const before = items.slice(0, index)
  const after = items.slice(index + 1)
  return [...before, newItem, ...after]
}

export const itemLeftCreate = (state: Readonly<State>, name: string, text: string, tooltip: string): State => {
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

const getIndex = (items: readonly StatusBarItem[], item: Readonly<StatusBarItem>): number => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].name === item.name) {
      return i
    }
  }
  return -1
}

export const itemLeftUpdate = (state: Readonly<State>, newItem: Readonly<StatusBarItem>): State => {
  return {
    ...state,
    statusBarItemsLeft: updateArray([...state.statusBarItemsLeft], newItem),
  }
}

export const itemRightCreate = (state: Readonly<State>, newItem: Readonly<StatusBarItem>): State => {
  const { statusBarItemsRight } = state
  const newStatusBarItemsRight = [...statusBarItemsRight, newItem]
  return {
    ...state,
    statusBarItemsRight: newStatusBarItemsRight,
  }
}

export const itemRightUpdate = (state: Readonly<State>, newItem: Readonly<StatusBarItem>): State => {
  const { statusBarItemsRight } = state
  const newStatusBarItemsRight = updateArray([...statusBarItemsRight], newItem)
  return {
    ...state,
    statusBarItemsRight: newStatusBarItemsRight,
  }
}

export const handleClick = (state: Readonly<State>, name: string): State => {
  // TODO
  // sendExtensionWorker([/* statusBarItemHandleClick */ 7657, /* name */ name])
  return state
}
