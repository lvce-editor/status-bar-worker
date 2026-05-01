import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getProblemsAriaLabel } from '../GetProblemsAriaLabel/GetProblemsAriaLabel.ts'
import * as InputName from '../InputName/InputName.ts'

interface GetBuiltinStatusBarItemsOptions {
  readonly notificationsEnabled?: boolean
  readonly problemsEnabled?: boolean
}

export const getBuiltinStatusBarItems = async (
  errorCount: number,
  warningCount: number,
  { notificationsEnabled = true, problemsEnabled = true }: GetBuiltinStatusBarItemsOptions = {},
): Promise<readonly StatusBarItem[]> => {
  const extraItems: StatusBarItem[] = []
  if (notificationsEnabled) {
    extraItems.push({
      ariaLabel: 'Notifications',
      command: '', // TODO should show notifications center
      elements: [{ type: 'text', value: 'Notifications' }],
      name: InputName.Notifications,
      tooltip: 'Notifications',
    })
  }
  if (problemsEnabled) {
    extraItems.push({
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
    })
  }
  return extraItems
}
