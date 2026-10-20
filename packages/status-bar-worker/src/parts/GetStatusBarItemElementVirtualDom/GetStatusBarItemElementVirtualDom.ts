import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { ClassNames, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type {
  StatusBarItemElement,
  StatusBarItemIcon,
  StatusBarItemProgress,
  StatusBarItemText,
} from '../StatusBarItemElement/StatusBarItemElement.ts'

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
      className: mergeClassNames(ClassNames.MaskIcon, 'StatusBarIcon', element.value, element.spinning ? 'Spinning' : ''),
      name,
      type: VirtualDomElements.Div,
    },
  ]
}

const getProgressVirtualDom = (element: StatusBarItemProgress, name: string): readonly VirtualDomNode[] => {
  const node: VirtualDomNode = {
    ariaLabel: element.ariaLabel,
    className: 'StatusBarItemProgress',
    max: element.max,
    name,
    type: VirtualDomElements.Progress,
  }
  if (element.value !== undefined) {
    return [{ ...node, value: element.value }]
  }
  return [node]
}

export const getStatusBarItemElementVirtualDom = (element: StatusBarItemElement, name: string): readonly VirtualDomNode[] => {
  if (element.type === 'text') {
    return getTextVirtualDom(element, name)
  }
  if (element.type === 'icon') {
    return getIconVirtualDom(element, name)
  }
  if (element.type === 'progress') {
    return getProgressVirtualDom(element, name)
  }
  return []
}
