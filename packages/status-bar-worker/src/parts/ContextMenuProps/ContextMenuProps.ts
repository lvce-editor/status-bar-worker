import type * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export interface ContextMenuProps {
  readonly contextMenuItems?: readonly {
    readonly args?: readonly unknown[]
    readonly command: string
    readonly id: string
    readonly label: string
  }[]
  readonly menuId: typeof MenuEntryId.StatusBar
}
