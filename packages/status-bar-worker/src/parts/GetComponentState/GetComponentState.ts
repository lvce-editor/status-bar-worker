import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

export const getComponentState = (uid: number): StatusBarState => {
  return StatusBarStates.get(uid).newState
}
