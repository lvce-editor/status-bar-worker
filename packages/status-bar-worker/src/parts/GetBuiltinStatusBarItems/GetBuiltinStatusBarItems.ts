import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as InputName from '../InputName/InputName.ts'

export const getBuiltinStatusBarItems = async (): Promise<readonly StatusBarItem[]> => {
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
  return extraItems
}
