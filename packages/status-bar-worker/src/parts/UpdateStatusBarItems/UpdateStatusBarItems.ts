import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'

export const updateStatusBarItems = async (state: StatusBarState): Promise<StatusBarState> => {
  const newState = await LoadContent.loadContent(state)
  return newState
}
