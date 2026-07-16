import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-preserves-builtins'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.custom',
    elements: [{ type: 'text', value: 'test.custom' }],
    name: 'test.custom',
    tooltip: 'test.custom',
  })

  const notifications = Locator('.StatusBarItem[name="Notifications"]')
  await expect(notifications).toBeVisible()
  const problems = Locator('.StatusBarItem[name="Problems"]')
  await expect(problems).toBeVisible()
  const custom = Locator('.StatusBarItem[name="test.custom"]')
  await expect(custom).toBeVisible()
}
