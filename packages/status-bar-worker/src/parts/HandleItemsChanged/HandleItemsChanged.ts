import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { handleExtensionsChanged } from '../HandleExtensionsChanged/HandleExtensionsChanged.ts'

export const handleItemsChanged = async (state: StatusBarState): Promise<StatusBarState> => {
  return handleExtensionsChanged(state)
}
