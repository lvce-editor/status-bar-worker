import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-update-icon'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', {
    ariaLabel: 'test.update-icon',
    elements: [{ type: 'icon', value: 'OldIcon' }],
    name: 'test.update-icon',
    tooltip: 'test.update-icon',
  })
  await Command.execute('StatusBar.itemRightUpdate', {
    ariaLabel: 'test.update-icon',
    elements: [{ type: 'icon', value: 'NewIcon' }],
    name: 'test.update-icon',
    tooltip: 'test.update-icon',
  })

  const oldIcon = Locator('.StatusBarItem[name="test.update-icon"] .OldIcon')
  await expect(oldIcon).toHaveCount(0)
  const newIcon = Locator('.StatusBarItem[name="test.update-icon"] .NewIcon')
  await expect(newIcon).toBeVisible()
}
