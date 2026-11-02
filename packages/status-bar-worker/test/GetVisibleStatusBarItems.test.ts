import { expect, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { CacheWorker, TextMeasurementWorker } from '@lvce-editor/rpc-registry'
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

test('keeps an update progress item visible when measuring mixed status bar elements', async () => {
  setTextMeasurement()
  const item: StatusBarItem = {
    ariaLabel: 'Update download progress 90%',
    elements: [
      { type: 'text', value: 'Update' },
      { ariaLabel: 'Update download progress', max: 1, type: 'progress', value: 0.9 },
    ],
    name: 'update-progress',
    tooltip: 'Update download progress 90%',
  }
  const result = await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    width: 200,
  })
  expect(result.visibleStatusBarItemsLeft).toEqual([item])
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

test('persists measured text widths and uses them for new items on the next render', async () => {
  const cache = new Map<string, unknown>()
  let measurementCalls = 0
  CacheWorker.set(
    createMockRpc({
      commandMap: {
        'Cache.getCacheStorageJsonItem': async (key: string) => (cache.has(key) ? { value: cache.get(key) } : undefined),
        'Cache.setCacheStorageJsonItem': async (key: string, value: unknown) => {
          cache.set(key, value)
        },
      },
    }),
  )
  TextMeasurementWorker.set(
    createMockRpc({
      commandMap: {
        'TextMeasurement.measureTextWidths': async (texts: readonly string[]) => {
          measurementCalls++
          return texts.map((text) => text.length * 10)
        },
      },
    }),
  )
  const firstItem = createItem('first', 'cached label')
  await GetVisibleStatusBarItems.getVisibleStatusBarItems({ ...createDefaultState(), statusBarItemsLeft: [firstItem] })
  await Promise.resolve()
  expect(measurementCalls).toBe(1)
  expect(cache.size).toBe(1)
  expect(cache.keys().toArray()[0]).toMatch(/^https:\/\/cache\.invalid\/status-bar-measurements\/v1\//)

  const secondItem = createItem('second', 'cached label')
  await GetVisibleStatusBarItems.getVisibleStatusBarItems({ ...createDefaultState(), statusBarItemsLeft: [secondItem] })
  expect(measurementCalls).toBe(1)
})

test('remeasures malformed cached widths and renders when cache reads or writes fail', async () => {
  let measurementCalls = 0
  CacheWorker.set(
    createMockRpc({
      commandMap: {
        'Cache.getCacheStorageJsonItem': async () => ({ value: NaN }),
        'Cache.setCacheStorageJsonItem': async () => {
          throw new Error('cache unavailable')
        },
      },
    }),
  )
  TextMeasurementWorker.set(
    createMockRpc({
      commandMap: {
        'TextMeasurement.measureTextWidths': async (texts: readonly string[]) => {
          measurementCalls++
          return texts.map((text) => text.length * 10)
        },
      },
    }),
  )
  const item = createItem('item', 'valid label')
  const result = await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    width: 200,
  })
  expect(result.visibleStatusBarItemsLeft).toEqual([item])
  expect(measurementCalls).toBe(1)

  CacheWorker.set(
    createMockRpc({
      commandMap: {
        'Cache.getCacheStorageJsonItem': async () => {
          throw new Error('cache unavailable')
        },
        'Cache.setCacheStorageJsonItem': async () => {
          throw new Error('cache unavailable')
        },
      },
    }),
  )
  const secondResult = await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...createDefaultState(),
    statusBarItemsLeft: [createItem('another-item', 'another label')],
    width: 200,
  })
  expect(secondResult.visibleStatusBarItemsLeft).toHaveLength(1)
  expect(measurementCalls).toBe(2)
})

test('uses valid persisted widths on the first lookup, including zero', async () => {
  let measurementCalls = 0
  CacheWorker.set(
    createMockRpc({
      commandMap: {
        'Cache.getCacheStorageJsonItem': async (key: string) => ({ value: key.includes('zero-width-label') ? 0 : 42 }),
      },
    }),
  )
  TextMeasurementWorker.set(
    createMockRpc({
      commandMap: {
        'TextMeasurement.measureTextWidths': async (texts: readonly string[]) => {
          measurementCalls++
          return texts.map(() => 1000)
        },
      },
    }),
  )
  const items = [createItem('persisted', 'persisted-width-label'), createItem('zero', 'zero-width-label')]
  const result = await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...createDefaultState(),
    statusBarItemsLeft: items,
    width: 88,
  })
  expect(result.visibleStatusBarItemsLeft).toEqual(items)
  expect(measurementCalls).toBe(0)
})

test('bounds persistent cache traffic for huge inventories and coalesces repeated labels', async () => {
  let cacheReads = 0
  let cacheWrites = 0
  let measuredTexts = 0
  CacheWorker.set(
    createMockRpc({
      commandMap: {
        'Cache.getCacheStorageJsonItem': async () => {
          cacheReads++
          return undefined
        },
        'Cache.setCacheStorageJsonItem': async () => {
          cacheWrites++
        },
      },
    }),
  )
  TextMeasurementWorker.set(
    createMockRpc({
      commandMap: {
        'TextMeasurement.measureTextWidths': async (texts: readonly string[]) => {
          measuredTexts += texts.length
          return texts.map(() => 10)
        },
      },
    }),
  )
  const items = Array.from({ length: 100_000 }, (_, index) => createItem(`bulk-${index}`, `bulk label ${index % 1000}`))
  const result = await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...createDefaultState(),
    statusBarItemsLeft: items,
    width: 66,
  })
  expect(result.visibleStatusBarItemsLeft).toEqual(items.slice(0, 2))
  expect(measuredTexts).toBe(items.length)
  expect(cacheReads).toBeGreaterThan(0)
  expect(cacheReads).toBeLessThanOrEqual(256)
  expect(cacheWrites).toBe(cacheReads)

  // New item objects with an admitted label reuse the measurement without more disk I/O.
  const readsBefore = cacheReads
  const writesBefore = cacheWrites
  await GetVisibleStatusBarItems.getVisibleStatusBarItems({
    ...createDefaultState(),
    statusBarItemsLeft: [createItem('new-item', 'bulk label 0')],
  })
  expect(measuredTexts).toBe(items.length)
  expect(cacheReads).toBe(readsBefore)
  expect(cacheWrites).toBe(writesBefore)
})
