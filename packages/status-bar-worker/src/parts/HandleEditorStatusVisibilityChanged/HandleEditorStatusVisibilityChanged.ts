import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as EditorStatusState from '../EditorStatusState/EditorStatusState.ts'
import * as EditorStatusVisibilityState from '../EditorStatusVisibilityState/EditorStatusVisibilityState.ts'
import { handleEditorStatusChanged } from '../HandleEditorStatusChanged/HandleEditorStatusChanged.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleEditorStatusVisibilityChanged = (state: StatusBarState, visible: boolean): StatusBarState => {
  const { statusBarItemsRight } = state
  EditorStatusVisibilityState.setVisible(visible)
  if (!visible) {
    const editorItems = statusBarItemsRight.filter((item) => InputName.isEditorStatus(item.name))
    if (editorItems.length === 0) {
      return state
    }
    return {
      ...state,
      statusBarItemsRight: statusBarItemsRight.filter((item) => !InputName.isEditorStatus(item.name)),
    }
  }
  return handleEditorStatusChanged(state, EditorStatusState.get(), { editorStatus: undefined })
}
