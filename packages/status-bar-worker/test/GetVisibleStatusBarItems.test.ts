import { expect, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleStatusBarItems from '../src/parts/GetVisibleStatusBarItems/GetVisibleStatusBarItems.ts'

const createItem = (name: string, text = ''): StatusBarItem => ({
  ariaLabel: name,
  elements: text ? [{ type: 'text', value: text }] : [],
  name,
  tooltip: name,
})

const setTextMeasurement = (): void => {
  TextMeasurementWorker.set(
    createMockRpc({
      commandMap: {
        'TextMeasurement.measureTextWidths': async (texts: readonly string[]) => texts.map((text) => text.length * 10),
      },
    }),
  )
}

test('fits whole items at the exact boundary and hides items at zero or tiny widths', async () => {
  setTextMeasurement()
  const item = createItem('item', 'abc')
  const exactFit = await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    width: 60,
  })
  expect(exactFit.visibleStatusBarItemsLeft).toEqual([item])

  const zeroWidth = await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    width: 0,
  })
  expect(zeroWidth.visibleStatusBarItemsLeft).toEqual([])

  const tinyWidth = await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    width: 59,
  })
  expect(tinyWidth.visibleStatusBarItemsLeft).toEqual([])
})

test('accounts for icons, item spacing, and both groups sharing the available width', async () => {
  setTextMeasurement()
  const leftItem: StatusBarItem = {
    ...createItem('left', 'a'),
    elements: [
      { type: 'icon', value: 'Icon' },
      { type: 'text', value: 'a' },
    ],
  }
  const rightItem = createItem('right', 'a')
  const result = await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...createDefaultState(),
    statusBarItemsLeft: [leftItem],
    statusBarItemsRight: [rightItem],
    width: 80,
  })
  expect(result.visibleStatusBarItemsRight).toEqual([rightItem])
  expect(result.visibleStatusBarItemsLeft).toEqual([])
})

test('restores hidden items after expansion and uses updated text widths', async () => {
  setTextMeasurement()
  const firstItem = createItem('first', 'a')
  const secondItem = createItem('second', 'b')
  const initial = await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...createDefaultState(),
    statusBarItemsLeft: [firstItem, secondItem],
    width: 50,
  })
  expect(initial.visibleStatusBarItemsLeft).toEqual([firstItem])
  expect(initial.statusBarItemsLeft).toEqual([firstItem, secondItem])

  const expanded = await GetVisibleStatusBarItems.getVisibleStatusBarItems({ ...initial, width: 70 })
  expect(expanded.visibleStatusBarItemsLeft).toEqual([firstItem, secondItem])

  const updatedItem = createItem('first', 'longer')
  const updated = await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...expanded,
    statusBarItemsLeft: [updatedItem, secondItem],
    width: 70,
  })
  expect(updated.visibleStatusBarItemsLeft).toEqual([secondItem])
})
