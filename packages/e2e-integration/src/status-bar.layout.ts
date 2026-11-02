import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.layout'

export const test: Test = async ({ Command, expect, Locator, Settings }) => {
  await Settings.update({
    'statusBar.builtinNotificationsEnabled': true,
    'statusBar.builtinProblemsEnabled': true,
    'statusBar.itemsVisible': true,
  })
  await Command.execute('Layout.showStatusBar')
  await Command.execute('Layout.loadStatusBarIfVisible')

  const itemsLeft = Locator('.StatusBarItemsLeft')
  const statusBarItems = itemsLeft.locator('.StatusBarItem')
  const problems = itemsLeft.locator('.StatusBarItem[name="Problems"]')
  await expect(itemsLeft).toBeVisible()
  await expect(statusBarItems).toHaveCount(1)
  await expect(problems).toBeVisible()

  const itemsRight = Locator('.StatusBarItemsRight')
  const notifications = itemsRight.locator('.StatusBarItem[name="Notifications"]')
  await expect(notifications).toBeVisible()
}
