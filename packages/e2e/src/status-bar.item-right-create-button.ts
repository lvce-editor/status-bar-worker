import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-button'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.button',
    elements: [{ type: 'text', value: 'test.button' }],
    name: 'test.button',
    tooltip: 'test.button',
  })

  const item = Locator('button.StatusBarItem[name="test.button"]')
  await expect(item).toBeVisible()
  await expect(item).toHaveAttribute('role', null)
  await expect(item).toHaveAttribute('type', null)
}
