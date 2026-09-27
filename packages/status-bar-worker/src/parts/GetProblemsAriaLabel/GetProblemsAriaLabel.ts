import * as StatusBarStrings from '../StatusBarStrings/StatusBarStrings.ts'

export const getProblemsAriaLabel = (errorCount: number, warningCount: number): string => {
  const parts: string[] = []
  if (errorCount > 0) {
    parts.push(errorCount === 1 ? StatusBarStrings.problem(errorCount) : StatusBarStrings.problems(errorCount))
  }
  if (warningCount > 0) {
    parts.push(warningCount === 1 ? StatusBarStrings.warning(warningCount) : StatusBarStrings.warnings(warningCount))
  }
  if (parts.length === 0) {
    return StatusBarStrings.noProblems()
  }
  if (parts.length === 1) {
    return parts[0]
  }
  return StatusBarStrings.problemsAriaLabel(parts[0], parts[1])
}
