import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { UiStatusBarItem } from '../UiStatusBarItem/UiStatusBarItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.ts'
import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.ts'
import * as InputName from '../InputName/InputName.ts'

const toUiStatusBarItem = (extensionHostStatusBarItem: any): UiStatusBarItem => {
  return {
    command: extensionHostStatusBarItem.command || '',
    icon: extensionHostStatusBarItem.icon || '',
    name: extensionHostStatusBarItem.id || extensionHostStatusBarItem.name || '',
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

const toStatusBarItem = (uiStatusBarItem: UiStatusBarItem): StatusBarItem => {
  const elements: StatusBarItem['elements'] = []
  if (uiStatusBarItem.icon) {
    elements.push({ type: 'icon', value: uiStatusBarItem.icon })
  }
  if (uiStatusBarItem.text) {
    elements.push({ type: 'text', value: uiStatusBarItem.text })
  }
  if (elements.length === 0) {
    elements.push({ type: 'text', value: '' })
  }
  return {
    command: uiStatusBarItem.command || undefined,
    elements,
    name: uiStatusBarItem.name,
    tooltip: uiStatusBarItem.tooltip,
  }
}

export const getStatusBarItems = async (showItems: boolean): Promise<StatusBarItem[]> => {
  if (!showItems) {
    return []
  }
  await ExtensionHostManagement.activateByEvent('onSourceControl')
  const extensionStatusBarItems = await ExtensionHostStatusBarItems.getStatusBarItems()
  const uiStatusBarItems = toUiStatusBarItems(extensionStatusBarItems)
  const extraItems: readonly StatusBarItem[] = [
    {
      command: undefined,
      elements: [{ type: 'text', value: 'Notifications' }],
      name: InputName.Notifications,
      tooltip: '',
    },
    {
      command: undefined,
      elements: [
        { type: 'icon', value: ClassNames.ProblemsErrorIcon },
        { type: 'text', value: '0' },
        { type: 'icon', value: ClassNames.ProblemsWarningIcon },
        { type: 'text', value: '0' },
      ],
      name: InputName.Problems,
      tooltip: '',
    },
  ]
  return [...uiStatusBarItems.map(toStatusBarItem), ...extraItems]
}
