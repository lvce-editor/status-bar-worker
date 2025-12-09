import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as StatusBarPreferences from '../src/parts/StatusBarPreferences/StatusBarPreferences.ts'

test('itemsVisible should return true when preference is true', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'Preferences.get': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'Preferences.get') {
        const key = args[0]
        if (key === 'statusBar.itemsVisible') {
          return true
        }
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  const value = await StatusBarPreferences.itemsVisible()
  expect(value).toBe(true)
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})

test('itemsVisible should return false when preference is false', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'Preferences.get': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'Preferences.get') {
        const key = args[0]
        if (key === 'statusBar.itemsVisible') {
          return false
        }
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  const value = await StatusBarPreferences.itemsVisible()
  expect(value).toBe(false)
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})

test('itemsVisible should return false when preference is undefined', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'Preferences.get': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'Preferences.get') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  const value = await StatusBarPreferences.itemsVisible()
  expect(value).toBe(true)
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})
