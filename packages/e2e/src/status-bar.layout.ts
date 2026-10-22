import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.layout'

export const skip = 1

export const test: Test = async ({ expect, Locator }) => {
  const itemsLeft = Locator('.StatusBarItemsLeft')
  const statusBarItems = itemsLeft.locator('.StatusBarItem')
  const notifications = itemsLeft.locator('.StatusBarItem[name="Notifications"]')
  const problems = itemsLeft.locator('.StatusBarItem[name="Problems"]')
  await expect(itemsLeft).toBeVisible()
  await expect(statusBarItems).toHaveCount(2)
  await expect(notifications).toBeVisible()
  await expect(problems).toBeVisible()

  const itemsRight = Locator('.StatusBarItemsRight')
  await expect(itemsRight).toHaveCount(0)
}
