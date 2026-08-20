import type { UiStatusBarItem } from '../UiStatusBarItem/UiStatusBarItem.ts'

const getActualIcon = (extensionStatusBarItem: any): string => {
  if (extensionStatusBarItem.icon === 'branch') {
    return 'MaskIconSourceControl'
  }
  return extensionStatusBarItem.icon || ''
}

export const toUiStatusBarItem = (extensionStatusBarItem: any): UiStatusBarItem => {
  return {
    ariaLabel: extensionStatusBarItem.ariaLabel || '',
    command: extensionStatusBarItem.onClick || extensionStatusBarItem.command || '',
    icon: getActualIcon(extensionStatusBarItem),
    name: extensionStatusBarItem.id || extensionStatusBarItem.name || '',
    ...(extensionStatusBarItem.spinning === true && { spinning: true }),
    text: extensionStatusBarItem.text || '',
    tooltip: extensionStatusBarItem.tooltip || '',
  }
}
