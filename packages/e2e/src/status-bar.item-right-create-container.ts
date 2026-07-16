import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-container'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  const itemsRight = Locator('.StatusBarItemsRight')
  await expect(itemsRight).toHaveCount(0)

  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.right-container',
    elements: [{ type: 'text', value: 'test.right-container' }],
    name: 'test.right-container',
    tooltip: 'test.right-container',
  })

  await expect(itemsRight).toBeVisible()
  await expect(itemsRight.locator('.StatusBarItem')).toHaveCount(1)
}
