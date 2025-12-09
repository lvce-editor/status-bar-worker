import type { UiStatusBarItem } from '../UiStatusBarItem/UiStatusBarItem.ts'
import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.ts'
import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.ts'
import * as InputName from '../InputName/InputName.ts'

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
  const extraItems: readonly UiStatusBarItem[] = [
    {
      command: '',
      icon: '',
      name: InputName.Notifications,
      text: 'Notifications',
      tooltip: '',
    },
    {
      command: '',
      icon: '',
      name: InputName.Problems,
      text: 'Problems',
      tooltip: '',
    },
  ]
  return [...uiStatusBarItems, ...extraItems]
}
