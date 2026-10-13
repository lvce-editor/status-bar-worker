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
  const patches = diffTree(oldDom, newDom)
  // The renderer treats a solitary Add as a legacy complete initial tree.
  // A tree diff can instead append the right group; send a full tree for
  // this ambiguous encoding so the status-bar root is preserved.
  if (patches.length === 1 && patches[0].type === 6) {
    return renderItems(oldState, newState)
  }
  if (patches.length === 0) {
    return []
  }
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
