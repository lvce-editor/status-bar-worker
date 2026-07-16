import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-tab-index'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.tab-index',
    elements: [{ type: 'text', value: 'test.tab-index' }],
    name: 'test.tab-index',
    tooltip: 'test.tab-index',
  })

  const item = Locator('.StatusBarItem[name="test.tab-index"]')
  await expect(item).toHaveAttribute('tabindex', '-1')
}
