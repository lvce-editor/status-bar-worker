import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-update-preserves-builtins'

export const test: Test = async ({ Command, expect, Locator, Settings, StatusBar }) => {
  await Settings.update({
    'statusBar.builtinNotificationsEnabled': true,
    'statusBar.builtinProblemsEnabled': true,
    'statusBar.itemsVisible': true,
  })
  await Command.execute('Layout.showStatusBar')
  await Command.execute('Layout.loadStatusBarIfVisible')

  const notifications = Locator('.StatusBarItem[name="Notifications"]')
  const problems = Locator('.StatusBarItem[name="Problems"]')
  await expect(notifications).toBeVisible()
  await expect(problems).toBeVisible()

  await StatusBar.createItemRight({
    ariaLabel: 'Initial accessible label',
    elements: [{ type: 'text', value: 'Initial text' }],
    name: 'test.update-preserves-builtins',
    tooltip: 'Initial tooltip',
  })

  const item = Locator('.StatusBarItem[name="test.update-preserves-builtins"]')
  await expect(item).toHaveText('Initial text')
  await StatusBar.updateItemRight({
    ariaLabel: 'Updated accessible label',
    elements: [{ type: 'text', value: 'Updated text' }],
    name: 'test.update-preserves-builtins',
    tooltip: 'Updated tooltip',
  })

  await expect(item).toHaveText('Updated text')
  await expect(item).toHaveAttribute('aria-label', 'Updated accessible label')
  await expect(item).toHaveAttribute('title', 'Updated tooltip')
  await expect(notifications).toBeVisible()
  await expect(problems).toBeVisible()
}
