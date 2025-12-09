import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostCommandType from '../src/parts/ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as GetStatusBarItems from '../src/parts/GetStatusBarItems/GetStatusBarItems.ts'

test('getStatusBarItems should return empty array when showItems is false', async () => {
  const result = await GetStatusBarItems.getStatusBarItems(false)
  expect(result).toEqual([])
})

test('getStatusBarItems should return transformed items when showItems is true', async () => {
  const mockRendererRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRendererRpc)

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === ExtensionHostCommandType.GetStatusBarItems) {
        return [
          {
            command: 'test.command',
            icon: 'test-icon',
            id: 'test.item',
            text: 'Test Item',
            tooltip: 'Test Tooltip',
          },
        ]
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(result).toEqual([
    {
      command: 'test.command',
      icon: 'test-icon',
      name: 'test.item',
      text: 'Test Item',
      tooltip: 'Test Tooltip',
    },
    {
      command: '',
      icon: '',
      name: 'Notifications',
      text: 'Notifications',
      tooltip: '',
    },
  ])
})

test('getStatusBarItems should return empty array when no items are returned', async () => {
  const mockRendererRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRendererRpc)

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === ExtensionHostCommandType.GetStatusBarItems) {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(result).toEqual([
    {
      command: '',
      icon: '',
      name: 'Notifications',
      text: 'Notifications',
      tooltip: '',
    },
  ])
})

test('getStatusBarItems should handle null items', async () => {
  const mockRendererRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRendererRpc)

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === ExtensionHostCommandType.GetStatusBarItems) {
        return null
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(result).toEqual([
    {
      command: '',
      icon: '',
      name: 'Notifications',
      text: 'Notifications',
      tooltip: '',
    },
  ])
})

test('getStatusBarItems should handle undefined items', async () => {
  const mockRendererRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRendererRpc)

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === ExtensionHostCommandType.GetStatusBarItems) {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(result).toEqual([
    {
      command: '',
      icon: '',
      name: 'Notifications',
      text: 'Notifications',
      tooltip: '',
    },
  ])
})

test('getStatusBarItems should default missing fields to empty strings', async () => {
  const mockRendererRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRendererRpc)

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === ExtensionHostCommandType.GetStatusBarItems) {
        return [
          {
            id: 'item1',
          },
          {
            text: 'Item 2',
          },
        ]
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(result).toEqual([
    {
      command: '',
      icon: '',
      name: 'item1',
      text: '',
      tooltip: '',
    },
    {
      command: '',
      icon: '',
      name: '',
      text: 'Item 2',
      tooltip: '',
    },
    {
      command: '',
      icon: '',
      name: 'Notifications',
      text: 'Notifications',
      tooltip: '',
    },
  ])
})

test('getStatusBarItems should handle multiple items', async () => {
  const mockRendererRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRendererRpc)

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === ExtensionHostCommandType.GetStatusBarItems) {
        return [
          {
            command: 'command1',
            icon: 'icon1',
            id: 'item1',
            text: 'Item 1',
            tooltip: 'Tooltip 1',
          },
          {
            command: 'command2',
            icon: 'icon2',
            id: 'item2',
            text: 'Item 2',
            tooltip: 'Tooltip 2',
          },
        ]
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(result).toEqual([
    {
      command: 'command1',
      icon: 'icon1',
      name: 'item1',
      text: 'Item 1',
      tooltip: 'Tooltip 1',
    },
    {
      command: 'command2',
      icon: 'icon2',
      name: 'item2',
      text: 'Item 2',
      tooltip: 'Tooltip 2',
    },
    {
      command: '',
      icon: '',
      name: 'Notifications',
      text: 'Notifications',
      tooltip: '',
    },
  ])
})
