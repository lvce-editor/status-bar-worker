export const getProblemsAriaLabel = (errorCount: number, warningCount: number): string => {
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
