import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
<<<<<<< HEAD
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
=======
import { VirtualDomElements, AriaRoles, text } from '@lvce-editor/virtual-dom-worker'
>>>>>>> origin/main
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as GetStatusBarItemVirtualDom from '../GetStatusBarItemVirtualDom/GetStatusBarItemVirtualDom.ts'

<<<<<<< HEAD
=======
const getStatusBarItemVirtualDom = (statusBarItem: StatusBarItem): readonly VirtualDomNode[] => {
  const { tooltip } = statusBarItem
  return [
    {
      childCount: 1,
      className: ClassNames.StatusBarItem,
      role: AriaRoles.Button,
      tabIndex: -1,
      title: tooltip,
      type: VirtualDomElements.Div,
    },
    text(statusBarItem.text),
  ]
}

>>>>>>> origin/main
export const getStatusBarItemsVirtualDom = (items: readonly StatusBarItem[], className: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: items.length,
      className,
      type: VirtualDomElements.Div,
    },
    ...items.flatMap(GetStatusBarItemVirtualDom.getStatusBarItemVirtualDom),
  ]
}
