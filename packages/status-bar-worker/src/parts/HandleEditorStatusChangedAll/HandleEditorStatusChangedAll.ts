import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import * as EditorStatusState from '../EditorStatusState/EditorStatusState.ts'
import { handleEditorStatusChanged } from '../HandleEditorStatusChanged/HandleEditorStatusChanged.ts'
import { renderOutOfBand } from '../RenderOutOfBand/RenderOutOfBand.ts'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

export const handleEditorStatusChangedAll = async (update: Partial<EditorStatus> | undefined): Promise<void> => {
  const previous = { editorStatus: EditorStatusState.get() }
  const editorStatus = EditorStatusState.applyUpdate(update)
  const changedUids: number[] = []
  for (const uid of StatusBarStates.getKeys()) {
    const { newState, oldState } = StatusBarStates.get(uid)
    const newerState = handleEditorStatusChanged(newState, editorStatus, previous)
    if (newState === newerState || oldState === newerState) {
      continue
    }
    StatusBarStates.set(uid, oldState, newerState)
    changedUids.push(uid)
  }
  await Promise.all(changedUids.map(renderOutOfBand))
}
