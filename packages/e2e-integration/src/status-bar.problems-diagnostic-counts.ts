import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.problems-diagnostic-counts'

const waitFor = async (assertion: () => Promise<void>): Promise<void> => {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      await assertion()
      return
    } catch (error) {
      if (attempt === 0 || attempt === 99) console.info('[diagnostics readiness]', attempt, String(error))
      if (attempt === 99) throw error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main, Settings, Workspace }) => {
  console.info('[diagnostics phase] start')
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/main.ts`
  const problemUri = `${tmpDir}/file.xyz`
  await FileSystem.writeFile(uri, 'const foo: string = 123\n\nconsole.log(foo)\n')
  await FileSystem.writeFile(problemUri, 'first line\nsecond line')
  await Settings.update({
    'editor.diagnostics': true,
    'statusBar.builtinProblemsEnabled': true,
    'statusBar.itemsVisible': true,
  })
  await Command.execute('Layout.showStatusBar')
  await Command.execute('Layout.loadStatusBarIfVisible')
  console.info('[diagnostics phase] setting workspace')
  await Workspace.setUri(tmpDir)
  console.info('[diagnostics phase] opening TypeScript file')
  await Main.openUri(uri)
  console.info('[diagnostics phase] adding extension')
  await Extension.addWebExtension(import.meta.resolve('../fixtures/status-bar.problems'))
  console.info('[diagnostics phase] disabling extension')
  await Extension.disableWorkspace('test.status-bar-problems')

  const expectedDiagnostics = [
    {
      code: 2322,
      columnIndex: 6,
      endColumnIndex: 9,
      endRowIndex: 0,
      message: "Type 'number' is not assignable to type 'string'.",
      rowIndex: 0,
      source: 'ts',
      type: 'error',
      uri,
    },
  ] as const
  console.info('[diagnostics phase] waiting for TypeScript diagnostics')
  await waitFor(() => Editor.shouldHaveDiagnostics(expectedDiagnostics))
  console.info('[diagnostics phase] TypeScript diagnostics ready')

  await Main.openUri(problemUri)
  const itemProblems = Locator('.StatusBarItem[name="Problems"]')
  const problemCounts = itemProblems.locator('.StatusBarItemLabel')
  const errorCount = problemCounts.first()
  const warningCount = problemCounts.nth(1)
  await expect(itemProblems).toBeVisible()
  await expect(problemCounts).toHaveCount(2)
  await expect(errorCount).toHaveText('0')
  await expect(warningCount).toHaveText('0')

  await Command.execute('StatusBar.handleExtensionsChanged')
  await expect(itemProblems).toBeVisible()
  await expect(errorCount).toHaveText('0')
  await expect(warningCount).toHaveText('0')

  console.info('[diagnostics phase] enabling extension')
  await Extension.enableWorkspace('test.status-bar-problems')
  await expect(warningCount).toHaveText('2')

  await Command.execute('StatusBar.handleExtensionsChanged')
  await expect(itemProblems).toBeVisible()
  await expect(warningCount).toHaveText('2')

  console.info('[diagnostics phase] disabling extension')
  await Extension.disableWorkspace('test.status-bar-problems')
  await expect(warningCount).toHaveText('0')

  for (const count of [10, 100, 1000, 10_000, 100_000, 1_000_000, 1]) {
    await Command.execute('StatusBar.handleProblemsSummaryChange', {
      errorCount: count,
      hasEditor: true,
      warningCount: 0,
    })
    await expect(errorCount).toHaveText(String(count))
    await expect(warningCount).toHaveText('0')
  }

  console.info('[diagnostics phase] closing editors')
  await Main.closeAllEditors()
  await expect(errorCount).toHaveText('0')
  await expect(warningCount).toHaveText('0')
}
