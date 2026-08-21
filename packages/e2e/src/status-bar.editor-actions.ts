import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.editor-actions'

export const skip = 1

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/status-bar.ts`, 'first\nsecond line')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/status-bar.ts`)
  await Editor.setCursor(1, 6)

  await Command.execute('StatusBar.handleClick', 0, 'EditorPosition')
  const quickPickInput = Locator('#QuickPick .InputBox')
  await expect(quickPickInput).toHaveValue(':2:7')
  await Command.execute('QuickPick.close')

  await Command.execute('StatusBar.handleClick', 0, 'EditorIndentation')
  const quickPickItems = Locator('.QuickPickItemLabel')
  const spaces = quickPickItems.nth(0)
  const tabs = quickPickItems.nth(1)
  await expect(spaces).toHaveText('Indent Using Spaces')
  await expect(tabs).toHaveText('Indent Using Tabs')
  await Command.execute('QuickPick.close')

  await Command.execute('StatusBar.handleClick', 0, 'EditorEndOfLine')
  const lf = quickPickItems.nth(0)
  const crlf = quickPickItems.nth(1)
  await expect(lf).toHaveText('LF')
  await expect(crlf).toHaveText('CRLF')
  await Command.execute('QuickPick.close')

  await Command.execute('StatusBar.handleClick', 0, 'EditorLanguage')
  const quickPick = Locator('#QuickPick')
  await expect(quickPick).toBeVisible()
}
