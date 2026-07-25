import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { ClassNames, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItemElement, StatusBarItemIcon, StatusBarItemText } from '../StatusBarItemElement/StatusBarItemElement.ts'

const getTextVirtualDom = (element: StatusBarItemText, name: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'StatusBarItemLabel',
      name,
      type: VirtualDomElements.Span,
    },
    text(element.value),
  ]
}

const getIconVirtualDom = (element: StatusBarItemIcon, name: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.MaskIcon, element.value, element.spinning ? 'Spinning' : ''),
      name,
      type: VirtualDomElements.Div,
    },
  ]
}

export const getStatusBarItemElementVirtualDom = (element: StatusBarItemElement, name: string): readonly VirtualDomNode[] => {
  if (element.type === 'text') {
    return getTextVirtualDom(element, name)
  }
  if (element.type === 'icon') {
    return getIconVirtualDom(element, name)
  }
  return []
}
