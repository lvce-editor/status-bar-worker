import { expect, test } from '@jest/globals'
import { CacheWorker, TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getVisibleStatusBarItems } from '../src/parts/GetVisibleStatusBarItems/GetVisibleStatusBarItems.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'

const createItem = (name: string, value: string): StatusBarItem => ({
  ariaLabel: value,
  elements: [{ type: 'text', value }],
  name,
  tooltip: value,
})

test('changing editor positions retain exact overflow measurement without persistent cache traffic', async () => {
  using cache = CacheWorker.registerMockRpc({
    'Cache.getCacheStorageJsonItem': () => undefined,
    'Cache.setCacheStorageJsonItem': () => {},
  })
  using measurement = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.measureTextWidths': (values: readonly string[]) => values.map((value) => value.length * 10),
  })
  const short = createItem(InputName.EditorPosition, 'Ln1Col1')
  const long = createItem(InputName.EditorPosition, 'Ln1000Col10000')
  const state = await getVisibleStatusBarItems({ ...createDefaultState(), statusBarItemsRight: [short], width: 110 })
  expect(state.visibleStatusBarItemsRight).toEqual([short])
  const updated = await getVisibleStatusBarItems({ ...state, statusBarItemsRight: [long] })
  expect(updated.visibleStatusBarItemsRight).toEqual([])
  expect(measurement.invocations).toHaveLength(2)
  expect(cache.invocations).toEqual([])
})

test('stable labels still persist and reuse widths alongside changing cursor positions', async () => {
  const values = new Map<string, unknown>()
  using cache = CacheWorker.registerMockRpc({
    'Cache.getCacheStorageJsonItem': (key: string) => (values.has(key) ? { value: values.get(key) } : undefined),
    'Cache.setCacheStorageJsonItem': (key: string, value: unknown) => {
      values.set(key, value)
    },
  })
  using measurement = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.measureTextWidths': (texts: readonly string[]) => texts.map((text) => text.length * 10),
  })
  const state = createDefaultState()
  for (const position of ['Ln1Col1', 'Ln1Col2']) {
    const items = [createItem(InputName.EditorLanguage, 'plaintext'), createItem(InputName.EditorPosition, position)]
    const result = await getVisibleStatusBarItems({ ...state, statusBarItemsRight: items, width: 1000 })
    expect(result.visibleStatusBarItemsRight).toEqual(items)
  }
  expect(cache.invocations.filter(([method]) => method === 'Cache.getCacheStorageJsonItem')).toHaveLength(2)
  expect(cache.invocations.filter(([method]) => method === 'Cache.setCacheStorageJsonItem')).toHaveLength(1)
  expect(measurement.invocations.map((invocation) => invocation[1])).toEqual([['plaintext', 'Ln1Col1'], ['Ln1Col2']])
})
