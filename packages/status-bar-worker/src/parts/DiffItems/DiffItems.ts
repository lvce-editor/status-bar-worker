import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

const areItemsEqual = (left: StatusBarState['visibleStatusBarItemsLeft'], right: StatusBarState['visibleStatusBarItemsLeft']): boolean => {
  return left.length === right.length && left.every((item, index) => item === right[index])
}

export const isEqual = (oldState: StatusBarState, newState: StatusBarState): boolean => {
  return (
    oldState.statusBarItemsLeft === newState.statusBarItemsLeft &&
    oldState.statusBarItemsRight === newState.statusBarItemsRight &&
    oldState.width === newState.width &&
    areItemsEqual(oldState.visibleStatusBarItemsLeft, newState.visibleStatusBarItemsLeft) &&
    areItemsEqual(oldState.visibleStatusBarItemsRight, newState.visibleStatusBarItemsRight)
  )
}
