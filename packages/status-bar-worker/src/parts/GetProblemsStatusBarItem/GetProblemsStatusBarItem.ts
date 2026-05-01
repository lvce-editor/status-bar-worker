import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getProblemsAriaLabel } from '../GetProblemsAriaLabel/GetProblemsAriaLabel.ts'
import * as InputName from '../InputName/InputName.ts'

export const getProblemsStatusBarItem = (errorCount: number, warningCount: number): StatusBarItem => {
  return {
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
  }
}