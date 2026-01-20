import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItemElement } from '../StatusBarItemElement/StatusBarItemElement.ts'

export const getStatusBarItemElementVirtualDom = (element: StatusBarItemElement): readonly VirtualDomNode[] => {
  if (element.type === 'text') {
    return [text(element.value)]
  }
  if (element.type === 'icon') {
    return [
      {
        childCount: 0,
        className: element.value,
        type: VirtualDomElements.Div,
      },
    ]
  }
  return []
}
