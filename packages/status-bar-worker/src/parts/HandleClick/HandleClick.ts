import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { getMatchingItem } from '../GetMatchingItem/GetMatchingItem.ts'
import { handleClickEditorStatus } from '../HandleClickEditorStatus/HandleClickEditorStatus.ts'
import { handleClickExtensionStatusBarItem } from '../HandleClickExtensionStatusBarItem/HandleClickExtensionStatusBarItem.ts'
import { handleClickNotification } from '../HandleClickNotification/HandleClickNotification.ts'
import { handleClickProblems } from '../HandleClickProblems/HandleClickProblems.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleClick = async (state: StatusBarState, name: string): Promise<StatusBarState> => {
  if (!name) {
    return state
  }
  const { editorStatus, statusBarItemsLeft, statusBarItemsRight } = state

  const item = getMatchingItem(statusBarItemsLeft, statusBarItemsRight, name)
  if (!item) {
    return state
  }
  if (item.name === InputName.Notifications) {
    await handleClickNotification()
  } else if (item.name === InputName.Problems) {
    await handleClickProblems()
  } else if (InputName.isEditorStatus(item.name)) {
    await handleClickEditorStatus(item.name, editorStatus)
  } else if (item.command && !InputName.isEditorStatus(item.name)) {
    await handleClickExtensionStatusBarItem(item.command)
  }
  // TODO
  // sendExtensionWorker([/* statusBarItemHandleClick */ 7657, /* name */ name])
  return state
}
