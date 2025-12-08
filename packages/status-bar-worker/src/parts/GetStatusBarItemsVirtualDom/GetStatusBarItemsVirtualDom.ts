import * as ClassNames from '../ClassNames/ClassNames.ts'
import { VirtualDomElements, AriaRoles, text } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

const getStatusBarItemVirtualDom = (statusBarItem: StatusBarItem): unknown[] => {
  const { tooltip } = statusBarItem
  const dom: unknown[] = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.StatusBarItem,
      role: AriaRoles.Button,
      tabIndex: -1,
      title: tooltip,
      childCount: 1,
    },
    text(statusBarItem.text),
  )
  return dom
}

export const getStatusBarItemsVirtualDom = (items: readonly StatusBarItem[], className: string): unknown[] => {
  return [
    {
      type: VirtualDomElements.Div,
      className,
      childCount: items.length,
    },
    ...items.flatMap(getStatusBarItemVirtualDom),
  ]
}
