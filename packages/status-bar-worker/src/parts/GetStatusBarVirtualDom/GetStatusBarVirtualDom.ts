import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetStatusBarItemsLeftDom from '../GetStatusBarItemsLeftDom/GetStatusBarItemsLeftDom.ts'
import * as GetStatusBarItemsRightDom from '../GetStatusBarItemsRightDom/GetStatusBarItemsRightDom.ts'

const getChildCount = (rightCount: number): number => {
  return rightCount > 0 ? 2 : 1
}

export const getStatusBarVirtualDom = (
  statusBarItemsLeft: readonly StatusBarItem[],
  statusBarItemsRight: readonly StatusBarItem[],
): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = [
    {
      childCount: getChildCount(statusBarItemsRight.length),
      className: 'StatusBar',
      onClick: DomEventListenerFunctions.HandleClick,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      role: AriaRoles.Status,
      type: VirtualDomElements.Div,
    },
    ...GetStatusBarItemsLeftDom.getStatusBarItemsLeftDom(statusBarItemsLeft),
    ...GetStatusBarItemsRightDom.getStatusBarItemsRightDom(statusBarItemsRight),
  ]
  return dom
}
