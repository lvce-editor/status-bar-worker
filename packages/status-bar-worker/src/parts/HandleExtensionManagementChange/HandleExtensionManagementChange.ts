import { handleItemsChanged } from '../HandleItemsChanged/HandleItemsChanged.ts'
import { renderOutOfBand } from '../RenderOutOfBand/RenderOutOfBand.ts'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

export const handleExtensionManagementChange = async (): Promise<void> => {
  for (const uid of StatusBarStates.getKeys()) {
    const { newState, oldState } = StatusBarStates.get(uid)
    const newerState = await handleItemsChanged(newState)
    if (newState === newerState || oldState === newerState) {
      continue
    }
    // Loading and other updates can finish while the provider query is pending.
    // Only replace the extension items; retain the current lifecycle and render baseline.
    const current = StatusBarStates.get(uid)
    StatusBarStates.set(uid, current.oldState, { ...current.newState, statusBarItemsLeft: newerState.statusBarItemsLeft })
    await renderOutOfBand(uid)
  }
}
