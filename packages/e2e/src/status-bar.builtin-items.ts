import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.builtin-items'

export const skip = 1

export const test: Test = async ({ expect, Locator }) => {
  const problems = Locator('.StatusBarItem[name="Problems"]')
  await expect(problems).toBeVisible()

  const errorIcon = problems.locator('.ProblemsErrorIcon')
  await expect(errorIcon).toBeVisible()

  const warningIcon = problems.locator('.ProblemsWarningIcon')
  await expect(warningIcon).toBeVisible()

  const problemCounts = problems.locator('.StatusBarItemLabel')
  await expect(problemCounts).toHaveCount(2)
  const errorCount = problemCounts.first()
  await expect(errorCount).toHaveText('0')
  const warningCount = problemCounts.nth(1)
  await expect(warningCount).toHaveText('0')

  const notifications = Locator('.StatusBarItem[name="Notifications"]')
  await expect(notifications).toBeVisible()
  await expect(notifications).toHaveText('Notifications')
}
