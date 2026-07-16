import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-update-preserves-order'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  for (const itemName of ['test.first', 'test.second']) {
    await Command.execute('StatusBar.itemRightCreate', 0, {
      ariaLabel: itemName,
      elements: [{ type: 'text', value: itemName }],
      name: itemName,
      tooltip: itemName,
    })
  }
  await Command.execute('StatusBar.itemRightUpdate', 0, {
    ariaLabel: 'test.first',
    elements: [{ type: 'text', value: 'Updated first' }],
    name: 'test.first',
    tooltip: 'test.first',
  })

  const items = Locator('.StatusBarItemsRight .StatusBarItem')
  const first = items.first()
  await expect(first).toHaveAttribute('name', 'test.first')
  await expect(first).toHaveText('Updated first')
  const second = items.nth(1)
  await expect(second).toHaveAttribute('name', 'test.second')
}
