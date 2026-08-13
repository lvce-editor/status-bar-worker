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
    StatusBarStates.set(uid, oldState, { ...newState, ...newerState })
    await renderOutOfBand(uid)
  }
}
