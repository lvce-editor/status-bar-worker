import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.context-menu'

export const skip = 1

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.handleContextMenu', 0, 0, 0)

  const hideStatusBar = Locator('.ContextMenuItem[title="Hide Status Bar"]')
  await expect(hideStatusBar).toBeVisible()
}
