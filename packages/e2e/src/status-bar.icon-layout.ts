import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.icon-layout'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', {
    ariaLabel: 'Synchronize Changes',
    elements: [
      { type: 'icon', value: 'MaskIconSync' },
      { type: 'text', value: '1↓ 0↑' },
    ],
    name: 'git.sync',
    tooltip: 'Synchronize Changes',
  })

  const item = Locator('.StatusBarItem[name="git.sync"]')
  const icon = item.locator('.MaskIconSync')
  const label = item.locator('.StatusBarItemLabel')
  await expect(icon).toHaveCSS('width', '16px')
  await expect(label).toHaveText('1↓ 0↑')
}
