import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-aria-label'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'Custom accessible label',
    elements: [{ type: 'text', value: 'test.aria-label' }],
    name: 'test.aria-label',
    tooltip: 'test.aria-label',
  })

  const item = Locator('.StatusBarItem[name="test.aria-label"]')
  await expect(item).toHaveAttribute('aria-label', 'Custom accessible label')
}
