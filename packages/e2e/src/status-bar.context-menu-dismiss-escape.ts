import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.context-menu-dismiss-escape'

export const test: Test = async ({ expect, KeyBoard, Locator, StatusBar }) => {
  await StatusBar.handleContextMenu(0, 0, 0)

  const hideStatusBar = Locator('.MenuItem', { hasText: 'Hide Status Bar' })
  await expect(hideStatusBar).toBeVisible()
  await KeyBoard.press('Escape')
  await expect(hideStatusBar).toHaveCount(0)
}
