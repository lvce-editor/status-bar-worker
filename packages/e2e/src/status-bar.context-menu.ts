import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.context-menu'

export const test: Test = async ({ expect, Locator, StatusBar }) => {
  await StatusBar.handleContextMenu(0, 0, 0)

  const hideStatusBar = Locator('.MenuItem', { hasText: 'Hide Status Bar' })
  await expect(hideStatusBar).toBeVisible()
}
