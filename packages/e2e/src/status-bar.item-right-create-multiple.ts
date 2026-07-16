import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-multiple'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  for (const itemName of ['test.first', 'test.second', 'test.third']) {
    await Command.execute('StatusBar.itemRightCreate', 0, {
      ariaLabel: itemName,
      elements: [{ type: 'text', value: itemName }],
      name: itemName,
      tooltip: itemName,
    })
  }

  const items = Locator('.StatusBarItemsRight .StatusBarItem')
  await expect(items).toHaveCount(3)
}
