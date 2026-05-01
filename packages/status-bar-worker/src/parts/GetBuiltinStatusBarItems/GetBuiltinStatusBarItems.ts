import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getProblemsAriaLabel } from '../GetProblemsAriaLabel/GetProblemsAriaLabel.ts'
import * as InputName from '../InputName/InputName.ts'

export const getBuiltinStatusBarItems = async (errorCount: number, warningCount: number): Promise<readonly StatusBarItem[]> => {
  const extraItems: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Notifications',
      command: '', // TODO should show notifications center
      elements: [{ type: 'text', value: 'Notifications' }],
      name: InputName.Notifications,
      tooltip: 'Notifications',
    },
    {
      ariaLabel: getProblemsAriaLabel(errorCount, warningCount),
      command: '', // TODO should show problems view
      elements: [
        { type: 'icon', value: ClassNames.ProblemsErrorIcon },
        { type: 'text', value: `${errorCount}` },
        { type: 'icon', value: ClassNames.ProblemsWarningIcon },
        { type: 'text', value: `${warningCount}` },
      ],
      name: InputName.Problems,
      tooltip: 'Problems',
    },
  ]
  return extraItems
}
