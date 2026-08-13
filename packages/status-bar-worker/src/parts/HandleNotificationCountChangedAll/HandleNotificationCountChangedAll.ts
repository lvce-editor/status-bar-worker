import { handleNotificationCountChanged } from '../HandleNotificationCountChanged/HandleNotificationCountChanged.ts'
import { renderOutOfBand } from '../RenderOutOfBand/RenderOutOfBand.ts'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

export const handleNotificationCountChangedAll = async (count: number): Promise<void> => {
  for (const uid of StatusBarStates.getKeys()) {
    const { newState, oldState } = StatusBarStates.get(uid)
    const newerState = handleNotificationCountChanged(newState, count)
    if (newState === newerState || oldState === newerState) {
      continue
    }
    StatusBarStates.set(uid, oldState, newerState)
    await renderOutOfBand(uid)
  }
}
