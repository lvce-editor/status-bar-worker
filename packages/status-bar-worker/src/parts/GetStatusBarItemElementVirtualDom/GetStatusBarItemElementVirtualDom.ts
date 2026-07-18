import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { ClassNames, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItemElement } from '../StatusBarItemElement/StatusBarItemElement.ts'

const getTextVirtualDom = (element: StatusBarItemElement, name: string): readonly VirtualDomNode[] => {
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

const getIconVirtualDom = (element: StatusBarItemElement, name: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.MaskIcon, element.value),
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
