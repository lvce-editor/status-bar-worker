import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.editor-items'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/status-bar.ts`, 'first\nsecond line')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/status-bar.ts`)
  await Command.execute('StatusBar.handleExtensionsChanged')

  const itemsLeft = Locator('.StatusBarItemsLeft')
  await expect(itemsLeft).toBeVisible()
  await expect(itemsLeft.locator('.StatusBarItem')).toHaveCount(0)

  const itemsRight = Locator('.StatusBarItemsRight')
  await expect(itemsRight).toBeVisible()

  const position = Locator('.StatusBarItem[name="EditorPosition"]')
  const indentation = Locator('.StatusBarItem[name="EditorIndentation"]')
  const encoding = Locator('.StatusBarItem[name="EditorEncoding"]')
  const language = Locator('.StatusBarItem[name="EditorLanguage"]')
  const utf8Display = ['UTF', '8'].join('-')
  await expect(position).toHaveText('Ln 1, Col 1')
  await expect(indentation).toHaveText('Spaces: 2')
  await expect(encoding).toHaveText(utf8Display)
  await expect(language).toHaveText('typescript')

  await Editor.setCursor(1, 6)

  await expect(position).toHaveText('Ln 2, Col 7')
}
