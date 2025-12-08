import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const create = (uid: number): void => {
  const state: StatusBarState = {
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  set(uid, state, state)
}
