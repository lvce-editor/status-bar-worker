import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.update-progress'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showStatusBar')
  await Command.execute('Layout.loadStatusBarIfVisible')
  await Command.execute('StatusBar.handleUpdateProgress', 0.9)

  const item = Locator('.StatusBarItem[name="update-progress"]')
  const progress = item.locator('progress')
  await expect(item).toBeVisible()
  await expect(item).toHaveText('Update')
  await expect(progress).toHaveAttribute('value', '0.9')
  await expect(progress).toHaveAttribute('aria-label', 'Update download progress')

  await Command.execute('StatusBar.handleUpdateProgress', null)
  await expect(item).toHaveCount(0)
}
