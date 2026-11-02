import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-update-aria-label'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', {
    ariaLabel: 'Initial accessible label',
    elements: [{ type: 'text', value: 'test.update-aria-label' }],
    name: 'test.update-aria-label',
    tooltip: 'test.update-aria-label',
  })
  await Command.execute('StatusBar.itemRightUpdate', {
    ariaLabel: 'Updated accessible label',
    elements: [{ type: 'text', value: 'test.update-aria-label' }],
    name: 'test.update-aria-label',
    tooltip: 'test.update-aria-label',
  })

  const item = Locator('.StatusBarItem[name="test.update-aria-label"]')
  await expect(item).toHaveAttribute('aria-label', 'Updated accessible label')
}
