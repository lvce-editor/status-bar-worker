import type { Test } from '@lvce-editor/test-with-playwright'

// The browser harness does not mount the status bar view; run this scenario in the integrated LVCE UI.
export const skip = 1

export const name = 'status-bar.problems-diagnostic-counts'

export const test: Test = async ({ Command, expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.xyz`, 'first line\nsecond line')
  await Workspace.setUri(tmpDir)
  await Extension.addWebExtension(import.meta.resolve('../fixtures/status-bar.problems'))
  await Extension.disableWorkspace('test.status-bar-problems')
  await Settings.update({ 'editor.diagnostics': true, 'workbench.experimental.modernUI': true })
  await Command.execute('Layout.showStatusBar')
  await Command.execute('Layout.loadStatusBarIfVisible')
  await Main.openUri(`${tmpDir}/file.xyz`)

  const itemProblems = Locator('.StatusBarItem[name="Problems"]')
  const problemCounts = itemProblems.locator('.StatusBarItemLabel')
  const errorCount = problemCounts.first()
  const warningCount = problemCounts.nth(1)
  await expect(itemProblems).toBeVisible()
  await expect(problemCounts).toHaveCount(2)
  await expect(errorCount).toHaveText('0')
  await expect(warningCount).toHaveText('0')

  await Extension.enableWorkspace('test.status-bar-problems')
  await expect(errorCount).toHaveText('0')
  await expect(warningCount).toHaveText('2')

  await Command.execute('StatusBar.handleExtensionsChanged')
  await expect(itemProblems).toBeVisible()
  await expect(errorCount).toHaveText('0')
  await expect(warningCount).toHaveText('2')

  await Extension.disableWorkspace('test.status-bar-problems')
  await expect(errorCount).toHaveText('0')
  await expect(warningCount).toHaveText('0')
}
