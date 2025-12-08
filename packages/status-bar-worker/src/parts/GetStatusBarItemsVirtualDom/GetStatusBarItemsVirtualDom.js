import * as ClassNames from '../ClassNames/ClassNames.js'
import { VirtualDomElements, AriaRoles, text } from '@lvce-editor/virtual-dom-worker'

const getStatusBarItemVirtualDom = (statusBarItem) => {
  // @ts-ignore
  const { tooltip, icon } = statusBarItem
  const dom = []
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

export const getStatusBarItemsVirtualDom = (items, className) => {
  return [
    {
      type: VirtualDomElements.Div,
      className,
      childCount: items.length,
    },
    ...items.flatMap(getStatusBarItemVirtualDom),
  ]
}
