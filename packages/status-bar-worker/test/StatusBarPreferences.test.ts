import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as StatusBarPreferences from '../src/parts/StatusBarPreferences/StatusBarPreferences.ts'

test('itemsVisible should return true when preference is true', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
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
  RendererWorker.set(mockRpc)
  const value = await StatusBarPreferences.itemsVisible()
  expect(value).toBe(true)
})

test('itemsVisible should return false when preference is false', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
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
  RendererWorker.set(mockRpc)
  const value = await StatusBarPreferences.itemsVisible()
  expect(value).toBe(false)
})

test('itemsVisible should return false when preference is undefined', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'Preferences.get') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)
  const value = await StatusBarPreferences.itemsVisible()
  expect(value).toBe(true)
})
