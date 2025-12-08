import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.ts'
import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.ts'

type UiStatusBarItem = {
  name: string
  text: string
  tooltip: string
  command: string
  icon: string
}

const toUiStatusBarItem = (extensionHostStatusBarItem: any): UiStatusBarItem => {
  return {
    command: extensionHostStatusBarItem.command || '',
    icon: extensionHostStatusBarItem.icon || '',
    name: extensionHostStatusBarItem.id || '',
    text: extensionHostStatusBarItem.text || '',
    tooltip: extensionHostStatusBarItem.tooltip || '',
  }
}

const toUiStatusBarItems = (statusBarItems: readonly any[] | null | undefined): UiStatusBarItem[] => {
  if (!statusBarItems) {
    return []
  }
  return statusBarItems.map(toUiStatusBarItem)
}

export const getStatusBarItems = async (showItems: boolean): Promise<UiStatusBarItem[]> => {
  if (!showItems) {
    return []
  }
  await ExtensionHostManagement.activateByEvent('onSourceControl')
  const extensionStatusBarItems = await ExtensionHostStatusBarItems.getStatusBarItems()
  const uiStatusBarItems = toUiStatusBarItems(extensionStatusBarItems)
  return uiStatusBarItems
}
