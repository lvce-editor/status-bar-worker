import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'status-bar.item-right-update-text'

export const test: Test = async ({ expect, Locator, StatusBar }) => {
  await StatusBar.createItemRight({
    ariaLabel: 'test.update-text',
    elements: [{ type: 'text', value: 'Initial text' }],
    name: 'test.update-text',
    tooltip: 'test.update-text',
  })
  await StatusBar.updateItemRight({
    ariaLabel: 'test.update-text',
    elements: [{ type: 'text', value: 'Updated text' }],
    name: 'test.update-text',
    tooltip: 'test.update-text',
  })

  const item = Locator('.StatusBarItem[name="test.update-text"]')
  await expect(item).toHaveText('Updated text')
  // A second update that restores an earlier value must still patch the DOM.
  for (const value of ['Initial text', 'Third text', 'Updated text']) {
    await StatusBar.updateItemRight({
      ariaLabel: 'test.update-text',
      elements: [{ type: 'text', value }],
      name: 'test.update-text',
      tooltip: 'test.update-text',
    })
    await expect(item).toHaveText(value)
  }
}
