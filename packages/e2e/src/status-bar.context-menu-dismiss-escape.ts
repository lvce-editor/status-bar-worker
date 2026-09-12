import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.context-menu-dismiss-escape'

export const test: Test = async ({ StatusBar, expect, KeyBoard, Locator }) => {
  await StatusBar.handleContextMenu(0, 0, 0)

  const hideStatusBar = Locator('.ContextMenuItem[title="Hide Status Bar"]')
  await expect(hideStatusBar).toBeVisible()
  await KeyBoard.press('Escape')
  await expect(hideStatusBar).toHaveCount(0)
}
