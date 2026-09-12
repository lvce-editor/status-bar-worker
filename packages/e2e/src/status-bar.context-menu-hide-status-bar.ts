import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.context-menu-hide-status-bar'

export const test: Test = async ({ ContextMenu, expect, Locator, StatusBar }) => {
  await StatusBar.handleContextMenu(0, 0, 0)

  await ContextMenu.selectItem('Hide Status Bar')

  const statusBar = Locator('.StatusBar')
  await expect(statusBar).toHaveCount(0)
}
