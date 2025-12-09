import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as Preferences from '../src/parts/Preferences/Preferences.ts'

test('get should return preference value', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'Preferences.get': async () => {},
    },
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
  const value = await Preferences.get('test.key')
  expect(value).toBe('test.value')
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})

test('get should return undefined for non-existent key', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'Preferences.get': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'getPreference' || method === 'Preferences.get') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  const value = await Preferences.get('non.existent.key')
  expect(value).toBeUndefined()
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})

test('get should handle different preference types', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'Preferences.get': async () => {},
    },
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
  const numberValue = await Preferences.get('number.key')
  expect(numberValue).toBe(42)
  const booleanValue = await Preferences.get('boolean.key')
  expect(booleanValue).toBe(true)
  const objectValue = await Preferences.get('object.key')
  expect(objectValue).toEqual({ nested: 'value' })
  expect(mockRpc.invocations.length).toBe(3)
})
