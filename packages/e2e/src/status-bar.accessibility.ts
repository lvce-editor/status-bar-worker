import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.accessibility'

export const skip = 1

export const test: Test = async ({ expect, Locator }) => {
  const statusBar = Locator('.StatusBar')
  await expect(statusBar).toBeVisible()
  await expect(statusBar).toHaveAttribute('role', 'status')

  const problems = Locator('button.StatusBarItem[name="Problems"]')
  await expect(problems).toHaveAttribute('aria-label', 'No Problems')
  await expect(problems).toHaveAttribute('role', null)
  await expect(problems).toHaveAttribute('type', null)
  await expect(problems).toHaveAttribute('tabindex', '-1')
  await expect(problems).toHaveAttribute('title', 'Problems')

  const notifications = Locator('button.StatusBarItem[name="Notifications"]')
  await expect(notifications).toHaveAttribute('aria-label', 'Notifications')
  await expect(notifications).toHaveAttribute('role', null)
  await expect(notifications).toHaveAttribute('type', null)
  await expect(notifications).toHaveAttribute('tabindex', '-1')
  await expect(notifications).toHaveAttribute('title', 'Notifications')
}
