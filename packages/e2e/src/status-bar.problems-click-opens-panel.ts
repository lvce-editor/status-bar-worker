import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.problems-click-opens-panel'

export const skip = 1

export const test: Test = async ({ StatusBar, expect, Locator }) => {
  await StatusBar.click('Problems')

  const problemsTab = Locator('.PanelTab[name="Problems"]')
  await expect(problemsTab).toBeVisible()
  const problemsView = Locator('.Viewlet.Problems')
  await expect(problemsView).toBeVisible()
}
