import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.root-accessibility'

export const test: Test = async ({ Command, expect, Locator }) => {
  const statusBar = Locator('.StatusBar')
  for (let i = 0; i < 2; i++) {
    await Command.execute('Layout.showStatusBar')
    await Command.execute('Layout.loadStatusBarIfVisible')
    await expect(statusBar).toHaveAttribute('role', 'status')
    await expect(statusBar).toHaveAttribute('aria-roledescription', 'Status Bar')
    await expect(statusBar).toHaveAttribute('aria-live', 'off')
    await expect(statusBar).toHaveAttribute('tabindex', '0')
    await Command.execute('Layout.hideStatusBar')
    await expect(statusBar).toHaveCount(0)
  }
}
