export const testManyStatusBarItems = async ({ Command, Extension, expect, Locator, Settings }, count) => {
  const extensionId = `sample.extension-many-status-bar-items-${count}`
  const extensionUri = new URL(`../extensions/${extensionId}/`, import.meta.url).toString()

  try {
    console.warn('[status-bar-step]', count, 'Settings.update({', performance.now())
    await Settings.update({
      'statusBar.builtinNotificationsEnabled': true,
      'statusBar.builtinProblemsEnabled': true,
      'statusBar.itemsVisible': true,
    })
    console.warn('[status-bar-step]', count, "Command.execute('Layout.showStatusBar')", performance.now())
    await Command.execute('Layout.showStatusBar')
    console.warn('[status-bar-step]', count, "Command.execute('Layout.loadStatusBarIfVisible')", performance.now())
    await Command.execute('Layout.loadStatusBarIfVisible')
    await expect(Locator('.StatusBarItem[name="Problems"]')).toHaveCount(1)
    console.warn('[status-bar-step]', count, 'Extension.addWebExtension(extensionUri)', performance.now())
    await Extension.addWebExtension(extensionUri)
    console.warn(
      '[status-bar-step]',
      count,
      "Command.execute('ExtensionHost.executeCommand', `manyStatusBarItems${count}.create`)",
      performance.now(),
    )
    await Command.execute('ExtensionHost.executeCommand', `manyStatusBarItems${count}.create`)
    console.warn('[status-bar-step]', count, "Command.execute('StatusBar.handleExtensionsChanged')", performance.now())
    await Command.execute('StatusBar.handleExtensionsChanged')

    await expect(Locator('.StatusBarItem[name="many-status-bar-items-0"]')).toHaveText('Item 0')

    if (count > 20) {
      console.warn('[status-bar-step]', count, "Command.execute('Layout.handleResize', 800, 720)", performance.now())
      await Command.execute('Layout.handleResize', 800, 720)
      await expect(Locator(`.StatusBarItem[name="many-status-bar-items-${count - 1}"]`)).toHaveCount(0)
      await expect(Locator('.StatusBarItem[name="many-status-bar-items-20"]')).toHaveCount(0)

      console.warn('[status-bar-step]', count, "Command.execute('Layout.handleResize', 1600, 720)", performance.now())
      await Command.execute('Layout.handleResize', 1600, 720)
      await expect(Locator('.StatusBarItem[name="many-status-bar-items-20"]')).toHaveCount(1)
    }
  } finally {
    console.warn('[status-bar-step]', count, 'Extension.disableWorkspace(extensionId)', performance.now())
    await Extension.disableWorkspace(extensionId)
    console.warn('[status-bar-step]', count, "Command.execute('StatusBar.handleExtensionsChanged')", performance.now())
    await Command.execute('StatusBar.handleExtensionsChanged')
  }

  await expect(Locator('.StatusBarItem[name^="many-status-bar-items-"]')).toHaveCount(0)
  await expect(Locator('.StatusBarItem[name="Problems"]')).toHaveCount(1)
}
