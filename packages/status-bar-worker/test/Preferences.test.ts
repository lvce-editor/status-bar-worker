import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as Preferences from '../src/parts/Preferences/Preferences.ts'

test('get should return preference value', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'getPreference' || method === 'Preferences.get') {
        const key = args[0]
        if (key === 'test.key') {
          return 'test.value'
        }
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)
  const value = await Preferences.get('test.key')
  expect(value).toBe('test.value')
})

test('get should return undefined for non-existent key', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'getPreference' || method === 'Preferences.get') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)
  const value = await Preferences.get('non.existent.key')
  expect(value).toBeUndefined()
})

test('get should handle different preference types', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'getPreference' || method === 'Preferences.get') {
        const key = args[0]
        if (key === 'number.key') {
          return 42
        }
        if (key === 'boolean.key') {
          return true
        }
        if (key === 'object.key') {
          return { nested: 'value' }
        }
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)
  const numberValue = await Preferences.get('number.key')
  expect(numberValue).toBe(42)
  const booleanValue = await Preferences.get('boolean.key')
  expect(booleanValue).toBe(true)
  const objectValue = await Preferences.get('object.key')
  expect(objectValue).toEqual({ nested: 'value' })
})
