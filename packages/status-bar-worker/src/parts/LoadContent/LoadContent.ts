import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as EditorStatusState from '../EditorStatusState/EditorStatusState.ts'
import * as EditorStatusVisibilityState from '../EditorStatusVisibilityState/EditorStatusVisibilityState.ts'
import * as GetStatusBarItems from '../GetStatusBarItems/GetStatusBarItems.ts'
import { handleEditorStatusChanged } from '../HandleEditorStatusChanged/HandleEditorStatusChanged.ts'
import { handleEditorStatusVisibilityChanged } from '../HandleEditorStatusVisibilityChanged/HandleEditorStatusVisibilityChanged.ts'
import { handleNotificationCountChanged } from '../HandleNotificationCountChanged/HandleNotificationCountChanged.ts'
import * as InputName from '../InputName/InputName.ts'
import * as NotificationCount from '../NotificationCount/NotificationCount.ts'
import * as StatusBarPreferences from '../StatusBarPreferences/StatusBarPreferences.ts'

export const loadContent = async (state: StatusBarState): Promise<StatusBarState> => {
  const { assetDir, errorCount, platform, warningCount } = state
  const editorStatus = EditorStatusState.get()
  const { builtinNotificationsEnabled, builtinProblemsEnabled, itemsVisible } = await StatusBarPreferences.loadStatusBarPreferences()
  const statusBarItems = await GetStatusBarItems.getStatusBarItems({
    assetDir,
    builtinNotificationsEnabled: builtinNotificationsEnabled,
    builtinProblemsEnabled: builtinProblemsEnabled,
    editorStatus,
    errorCount,
    platform,
    showItems: itemsVisible,
    warningCount,
  })
  const loadedState: StatusBarState = {
    ...state,
    editorStatus,
    errorCount: 0,
    initial: false,
    statusBarItemsLeft: statusBarItems.filter((item) => !InputName.isRight(item.name)),
    statusBarItemsRight: statusBarItems.filter((item) => InputName.isRight(item.name)),
    warningCount: 0,
  }
  let currentState = loadedState
  if (itemsVisible) {
    if (EditorStatusVisibilityState.isVisible()) {
      currentState = handleEditorStatusChanged(loadedState, EditorStatusState.get())
    } else {
      currentState = handleEditorStatusVisibilityChanged(loadedState, false)
    }
  }
  const latestNotificationCount = NotificationCount.get()
  if (latestNotificationCount === undefined) {
    return currentState
  }
  return handleNotificationCountChanged(currentState, latestNotificationCount)
}
