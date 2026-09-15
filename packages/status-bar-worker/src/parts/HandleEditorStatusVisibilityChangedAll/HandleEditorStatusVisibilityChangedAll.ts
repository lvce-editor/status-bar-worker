import * as EditorStatusVisibilityState from '../EditorStatusVisibilityState/EditorStatusVisibilityState.ts'
import { handleEditorStatusVisibilityChanged } from '../HandleEditorStatusVisibilityChanged/HandleEditorStatusVisibilityChanged.ts'
import { renderOutOfBand } from '../RenderOutOfBand/RenderOutOfBand.ts'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

export const handleEditorStatusVisibilityChangedAll = async (visible: boolean): Promise<void> => {
  if (EditorStatusVisibilityState.isVisible() === visible) {
    return
  }
  EditorStatusVisibilityState.setVisible(visible)
  const changedUids: number[] = []
  for (const uid of StatusBarStates.getKeys()) {
    const { newState, oldState } = StatusBarStates.get(uid)
    const newerState = handleEditorStatusVisibilityChanged(newState, visible)
    if (newState === newerState || oldState === newerState) {
      continue
    }
    StatusBarStates.set(uid, oldState, newerState)
    changedUids.push(uid)
  }
  await Promise.all(changedUids.map(renderOutOfBand))
}
