import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.layout'

export const skip = 1

export const test: Test = async ({ expect, Locator }) => {
  const itemsLeft = Locator('.StatusBarItemsLeft')
  await expect(itemsLeft).toBeVisible()
  await expect(itemsLeft.locator('.StatusBarItem')).toHaveCount(2)
  await expect(itemsLeft.locator('.StatusBarItem[name="Notifications"]')).toBeVisible()
  await expect(itemsLeft.locator('.StatusBarItem[name="Problems"]')).toBeVisible()

  const itemsRight = Locator('.StatusBarItemsRight')
  await expect(itemsRight).toHaveCount(0)
}
