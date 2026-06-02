import { handleItemsChanged } from '../HandleItemsChanged/HandleItemsChanged.ts'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

export const handleExtensionManagementChange = async (): Promise<void> => {
  const uids = StatusBarStates.getKeys()
  for (const uid of uids) {
    const { newState, oldState } = StatusBarStates.get(uid)
    const newerState = await handleItemsChanged(newState)
    if (newState === newerState || oldState === newerState) {
      continue
    }
    StatusBarStates.set(uid, oldState, {
      ...newState,
      ...newerState,
    })
  }
}
