import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.context-menu'

export const test: Test = async ({ expect, Locator, StatusBar }) => {
  await StatusBar.handleContextMenu(0, 0, 0)

  const hideStatusBar = Locator('.MenuItem', { hasText: 'Hide Status Bar' })
  const switchToMain = Locator('.MenuItem', { hasText: 'Switch to main branch' })
  await expect(hideStatusBar).toBeVisible()
  await expect(switchToMain).toHaveCount(0)
}
