import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-tooltip'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.tooltip',
    elements: [{ type: 'text', value: 'test.tooltip' }],
    name: 'test.tooltip',
    tooltip: 'Custom status bar tooltip',
  })

  const item = Locator('.StatusBarItem[name="test.tooltip"]')
  await expect(item).toHaveAttribute('title', 'Custom status bar tooltip')
}
