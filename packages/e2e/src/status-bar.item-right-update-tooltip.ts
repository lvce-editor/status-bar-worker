import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-update-tooltip'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.update-tooltip',
    elements: [{ type: 'text', value: 'test.update-tooltip' }],
    name: 'test.update-tooltip',
    tooltip: 'Initial tooltip',
  })
  await Command.execute('StatusBar.itemRightUpdate', 0, {
    ariaLabel: 'test.update-tooltip',
    elements: [{ type: 'text', value: 'test.update-tooltip' }],
    name: 'test.update-tooltip',
    tooltip: 'Updated tooltip',
  })

  const item = Locator('.StatusBarItem[name="test.update-tooltip"]')
  await expect(item).toHaveAttribute('title', 'Updated tooltip')
}
