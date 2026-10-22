import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-empty-text'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.empty-text',
    elements: [{ type: 'text', value: '' }],
    name: 'test.empty-text',
    tooltip: 'test.empty-text',
  })

  const item = Locator('.StatusBarItem[name="test.empty-text"]')
  const label = item.locator('.StatusBarItemLabel')
  await expect(item).toBeVisible()
  await expect(label).toHaveCount(1)
  await expect(item).toHaveText('')
}
