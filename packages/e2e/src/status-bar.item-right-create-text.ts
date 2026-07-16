import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-text'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.text',
    elements: [{ type: 'text', value: 'Hello Status Bar' }],
    name: 'test.text',
    tooltip: 'test.text',
  })

  const item = Locator('.StatusBarItem[name="test.text"]')
  await expect(item).toBeVisible()
  await expect(item).toHaveText('Hello Status Bar')
}
