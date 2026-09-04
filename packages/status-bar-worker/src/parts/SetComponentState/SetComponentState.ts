import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

const applyComponentState = (currentState: StatusBarState, state: StatusBarState): StatusBarState => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('Status Bar state must be an object')
  }
  if (state.uid !== currentState.uid) {
    throw new Error(`Status Bar state uid must remain ${currentState.uid}`)
  }
  return state
}

export const setComponentState = StatusBarStates.wrapCommand(applyComponentState)
