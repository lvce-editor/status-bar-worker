import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-create-icon-text'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', 0, {
    ariaLabel: 'test.icon-text',
    elements: [
      { type: 'icon', value: 'TestIcon' },
      { type: 'text', value: 'Ready' },
    ],
    name: 'test.icon-text',
    tooltip: 'test.icon-text',
  })

  const item = Locator('.StatusBarItem[name="test.icon-text"]')
  await expect(item.locator('.TestIcon')).toBeVisible()
  await expect(item.locator('.StatusBarItemLabel')).toHaveText('Ready')
}
