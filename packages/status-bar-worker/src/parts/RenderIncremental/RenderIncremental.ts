import { ViewletCommand } from '@lvce-editor/constants'
import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { getStatusBarVirtualDom } from '../GetStatusBarVirtualDom/GetStatusBarVirtualDom.ts'
import { renderItems } from '../RenderItems/RenderItems.ts'

export const renderIncremental = (oldState: StatusBarState, newState: StatusBarState): any => {
  if (oldState.initial) {
    return renderItems(oldState, newState)
  }
  const oldDom = getStatusBarVirtualDom(oldState.visibleStatusBarItemsLeft, oldState.visibleStatusBarItemsRight)
  const newDom = getStatusBarVirtualDom(newState.visibleStatusBarItemsLeft, newState.visibleStatusBarItemsRight)
  // Structural and visibility changes can replace or reorder item groups.
  // Keep their full-render fallback, including the renderer's ambiguous
  // solitary Add encoding. Only patch a stable tree of the same items.
  if (
    oldDom.length !== newDom.length ||
    oldDom.some((node, index) => {
      const other = newDom[index]
      return node.type !== other.type || node.childCount !== other.childCount || node.className !== other.className || node.name !== other.name
    })
  ) {
    return renderItems(oldState, newState)
  }
  const patches = diffTree(oldDom, newDom)
  if (patches.length === 0) {
    return []
  }
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
