import type * as StatusBarState from '../StatusBarState/StatusBarState.ts'

type State = StatusBarState.StatusBarState & {
  disposed?: boolean
}

export const handleClick = (state: Readonly<State>, name: string): State => {
  // TODO
  // sendExtensionWorker([/* statusBarItemHandleClick */ 7657, /* name */ name])
  return state
}
