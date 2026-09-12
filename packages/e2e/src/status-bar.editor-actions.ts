import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.editor-actions'

export const test: Test = async ({ StatusBar, Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/status-bar.ts`, 'first\nsecond line')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/status-bar.ts`)
  await Editor.setCursor(1, 6)

  await StatusBar.click('EditorPosition')
  const quickPickInput = Locator('#QuickPick .InputBox')
  await expect(quickPickInput).toHaveValue(':2:7')
  await Command.execute('QuickPick.close')

  await StatusBar.click('EditorIndentation')
  const quickPickItems = Locator('.QuickPickItemLabel')
  const spaces = quickPickItems.nth(0)
  const tabs = quickPickItems.nth(1)
  await expect(spaces).toHaveText('Indent Using Spaces')
  await expect(tabs).toHaveText('Indent Using Tabs')
  await Command.execute('QuickPick.close')

  await StatusBar.click('EditorEndOfLine')
  const lf = quickPickItems.nth(0)
  const crlf = quickPickItems.nth(1)
  await expect(lf).toHaveText('LF')
  await expect(crlf).toHaveText('CRLF')
  await Command.execute('QuickPick.close')

  await StatusBar.click('EditorLanguage')
  const quickPick = Locator('#QuickPick')
  await expect(quickPick).toBeVisible()
}
