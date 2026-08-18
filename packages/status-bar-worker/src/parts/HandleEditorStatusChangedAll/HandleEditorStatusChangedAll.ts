import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import * as EditorStatusState from '../EditorStatusState/EditorStatusState.ts'
import { handleEditorStatusChanged } from '../HandleEditorStatusChanged/HandleEditorStatusChanged.ts'
import { renderOutOfBand } from '../RenderOutOfBand/RenderOutOfBand.ts'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

export const handleEditorStatusChangedAll = async (editorStatus: EditorStatus | undefined): Promise<void> => {
  EditorStatusState.set(editorStatus)
  for (const uid of StatusBarStates.getKeys()) {
    const { newState, oldState } = StatusBarStates.get(uid)
    const newerState = handleEditorStatusChanged(newState, editorStatus)
    if (newState === newerState || oldState === newerState) {
      continue
    }
    StatusBarStates.set(uid, oldState, newerState)
    await renderOutOfBand(uid)
  }
}
