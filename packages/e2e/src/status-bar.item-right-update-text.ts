import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-update-text'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.update-text',
    elements: [{ type: 'text', value: 'Initial text' }],
    name: 'test.update-text',
    tooltip: 'test.update-text',
  })
  await Command.execute('StatusBar.itemRightUpdate', 0, {
    ariaLabel: 'test.update-text',
    elements: [{ type: 'text', value: 'Updated text' }],
    name: 'test.update-text',
    tooltip: 'test.update-text',
  })

  const item = Locator('.StatusBarItem[name="test.update-text"]')
  await expect(item).toHaveText('Updated text')
}
