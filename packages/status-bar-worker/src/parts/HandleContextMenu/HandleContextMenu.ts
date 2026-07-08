import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export const handleContextMenu = async (state: StatusBarState, button: number, x: number, y: number): Promise<StatusBarState> => {
  await ContextMenu.show2(state.uid, MenuEntryId.StatusBar, x, y, {
    menuId: MenuEntryId.StatusBar,
  })
  return state
}
