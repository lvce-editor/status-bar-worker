import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-role'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.role',
    elements: [{ type: 'text', value: 'test.role' }],
    name: 'test.role',
    tooltip: 'test.role',
  })

  const item = Locator('.StatusBarItem[name="test.role"]')
  await expect(item).toHaveAttribute('role', 'button')
}
