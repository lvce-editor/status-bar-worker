import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { VirtualDomElements, AriaRoles, text } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getStatusBarItemVirtualDom = (statusBarItem: StatusBarItem): readonly VirtualDomNode[] => {
  const { name, tooltip } = statusBarItem
  return [
    {
      childCount: 1,
      className: ClassNames.StatusBarItem,
      name,
      role: AriaRoles.Button,
      tabIndex: -1,
      title: tooltip,
      type: VirtualDomElements.Div,
    },
    text(statusBarItem.text),
  ]
}
