import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-icon'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.icon',
    elements: [{ type: 'icon', value: 'TestIcon' }],
    name: 'test.icon',
    tooltip: 'test.icon',
  })

  const icon = Locator('.StatusBarItem[name="test.icon"] .TestIcon')
  await expect(icon).toBeVisible()
  await expect(icon).toHaveClass('MaskIcon TestIcon')
}
