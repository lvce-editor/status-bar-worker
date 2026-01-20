import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import * as InputName from '../InputName/InputName.ts'

<<<<<<< Updated upstream
export const getBuiltinStatusBarItems = async (): Promise<readonly StatusBarItem[]> => {
  const errorCount = 0
  const warningCount = 0
  const extraItems: readonly StatusBarItem[] = [
    {
<<<<<<< HEAD
      command: undefined,
=======
const getProblemsAriaLabel = (errorCount: number, warningCount: number): string => {
  const parts: string[] = []
  if (errorCount > 0) {
    parts.push(`${errorCount} ${errorCount === 1 ? 'Problem' : 'Problems'}`)
  }
  if (warningCount > 0) {
    parts.push(`${warningCount} ${warningCount === 1 ? 'Warning' : 'Warnings'}`)
  }
  if (parts.length === 0) {
    return 'No Problems'
  }
  return parts.join(', ')
}

export const getBuiltinStatusBarItems = async (errorCount: number, warningCount: number): Promise<readonly StatusBarItem[]> => {
  const extraItems: readonly StatusBarItem[] = [
    {
      ariaLabel: 'Notifications',
      command: '', // TODO should show notifications center
>>>>>>> Stashed changes
=======
      command: '', // TODO should show notifications center
>>>>>>> origin/main
      elements: [{ type: 'text', value: 'Notifications' }],
      name: InputName.Notifications,
      tooltip: 'Notifications',
    },
    {
<<<<<<< HEAD
<<<<<<< Updated upstream
      command: undefined,
      elements: [
        { type: 'icon', value: ClassNames.ProblemsErrorIcon },
        { type: 'text', value: '0' },
        { type: 'icon', value: ClassNames.ProblemsWarningIcon },
        { type: 'text', value: '0' },
=======
      ariaLabel: getProblemsAriaLabel(errorCount, warningCount),
      command: '', // TODO should show problems view
      elements: [
        { type: 'icon', value: ClassNames.ProblemsErrorIcon },
        { type: 'text', value: `${errorCount}` },
        { type: 'icon', value: ClassNames.ProblemsWarningIcon },
        { type: 'text', value: `${warningCount}` },
>>>>>>> Stashed changes
=======
      command: '', // TODO should show problems view
      elements: [
        { type: 'icon', value: `MaskIcon MaskIconError` },
        { type: 'text', value: `${errorCount}` },
        { type: 'icon', value: `MaskIcon MaskIconWarning` },
        { type: 'text', value: `${warningCount}` },
>>>>>>> origin/main
      ],
      name: InputName.Problems,
      tooltip: 'Problems',
    },
  ]
  return extraItems
}
