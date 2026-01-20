import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as InputName from '../InputName/InputName.ts'

export const getBuiltinStatusBarItems = async (): Promise<readonly StatusBarItem[]> => {
  const errorCount = 0
  const warningCount = 0
  const extraItems: readonly StatusBarItem[] = [
    {
      command: '', // TODO should show notifications center
      elements: [{ type: 'text', value: 'Notifications' }],
      name: InputName.Notifications,
      tooltip: 'Notifications',
    },
    {
      command: '', // TODO should show problems view
      elements: [
        { type: 'icon', value: `MaskIcon MaskIconError` },
        { type: 'text', value: `${errorCount}` },
        { type: 'icon', value: `MaskIcon MaskIconWarning` },
        { type: 'text', value: `${warningCount}` },
      ],
      name: InputName.Problems,
      tooltip: 'Problems',
    },
  ]
  return extraItems
}
