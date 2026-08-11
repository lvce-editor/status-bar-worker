import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { getProblemsStatusBarItem } from '../GetProblemsStatusBarItem/GetProblemsStatusBarItem.ts'
import * as InputName from '../InputName/InputName.ts'

interface ProblemsSummary {
  readonly errorCount: number
  readonly hasEditor: boolean
  readonly warningCount: number
}

export const handleProblemsSummaryChange = (state: StatusBarState, summary: ProblemsSummary): StatusBarState => {
  const { errorCount: oldErrorCount, statusBarItemsLeft: oldStatusBarItemsLeft, warningCount: oldWarningCount } = state
  const errorCount = summary.hasEditor ? summary.errorCount : 0
  const warningCount = summary.hasEditor ? summary.warningCount : 0
  if (oldErrorCount === errorCount && oldWarningCount === warningCount) {
    return state
  }
  const problemsItem = getProblemsStatusBarItem(errorCount, warningCount, true)[0]
  const statusBarItemsLeft = oldStatusBarItemsLeft.map((item) => (item.name === InputName.Problems ? problemsItem : item))
  return {
    ...state,
    errorCount,
    statusBarItemsLeft,
    warningCount,
  }
}
