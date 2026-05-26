import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const handleExtensionsChanged = async (state: StatusBarState): Promise<StatusBarState> => {
  // TODO requery status bar items
  return state
}
