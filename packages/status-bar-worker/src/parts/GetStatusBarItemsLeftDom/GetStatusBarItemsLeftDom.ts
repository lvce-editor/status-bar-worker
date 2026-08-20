import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetStatusBarItemsVirtualDom from '../GetStatusBarItemsVirtualDom/GetStatusBarItemsVirtualDom.ts'

export const getStatusBarItemsLeftDom = (statusBarItemsLeft: readonly StatusBarItem[]): readonly VirtualDomNode[] => {
  if (statusBarItemsLeft.length === 0) {
    return [
      {
        childCount: 0,
        className: ClassNames.StatusBarItemsLeft,
        type: VirtualDomElements.Div,
      },
    ]
  }
  return GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(statusBarItemsLeft, ClassNames.StatusBarItemsLeft)
}
