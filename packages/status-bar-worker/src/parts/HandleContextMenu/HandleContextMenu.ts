import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import * as GetStatusBarItemContextMenuItems from '../GetStatusBarItemContextMenuItems/GetStatusBarItemContextMenuItems.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export const handleContextMenu = async (state: StatusBarState, button: number, x: number, y: number, targetName = ''): Promise<StatusBarState> => {
  const item = [...state.statusBarItemsLeft, ...state.statusBarItemsRight].find((statusBarItem) => statusBarItem.name === targetName)
  const contextMenuItems =
    item?.extensionId && item.providerId
      ? await GetStatusBarItemContextMenuItems.getStatusBarItemContextMenuItems(item.extensionId, item.providerId)
      : []
  await ContextMenu.show2(state.uid, MenuEntryId.StatusBar, x, y, {
    contextMenuItems,
    menuId: MenuEntryId.StatusBar,
  })
  return state
}
