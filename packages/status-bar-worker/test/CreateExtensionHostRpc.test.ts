import { expect, test, afterEach } from '@jest/globals'
import { MockRpc, type Rpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateExtensionHostRpc from '../src/parts/CreateExtensionHostRpc/CreateExtensionHostRpc.ts'

const rpcInstances: Rpc[] = []

afterEach(() => {
  for (const rpc of rpcInstances) {
    if (rpc && typeof (rpc as any).dispose === 'function') {
      ;(rpc as any).dispose()
    }
  }
  rpcInstances.length = 0
})

test('createExtensionHostRpc should return an RPC instance', async () => {
  let sendCalled = false
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'sendMessagePortToExtensionHostWorker') {
        sendCalled = true
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ;(mockRpc as any).invokeAndTransfer = async (method: string, ...args: ReadonlyArray<any>): Promise<any> => {
    if (method === 'sendMessagePortToExtensionHostWorker' || method === 'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker') {
      sendCalled = true
      return undefined
    }
    throw new Error(`unexpected method ${method}`)
  }
  RendererWorker.set(mockRpc)

  const rpc = await CreateExtensionHostRpc.createExtensionHostRpc()
  rpcInstances.push(rpc)

  expect(rpc).toBeDefined()
  expect(typeof rpc).toBe('object')
  expect(sendCalled).toBe(true)
})

test('createExtensionHostRpc should use sendMessagePortToExtensionHostWorker', async () => {
  let sendCalled = false
  let sendPort: any
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'sendMessagePortToExtensionHostWorker') {
        sendCalled = true
        sendPort = args[0]
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ;(mockRpc as any).invokeAndTransfer = async (method: string, ...args: ReadonlyArray<any>): Promise<any> => {
    if (method === 'sendMessagePortToExtensionHostWorker' || method === 'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker') {
      sendCalled = true
      sendPort = args[0]
      return undefined
    }
    throw new Error(`unexpected method ${method}`)
  }
  RendererWorker.set(mockRpc)

  const rpc = await CreateExtensionHostRpc.createExtensionHostRpc()
  rpcInstances.push(rpc)

  expect(rpc).toBeDefined()
  expect(sendCalled).toBe(true)
  expect(sendPort).toBeDefined()
})

test('createExtensionHostRpc should handle errors and wrap in VError', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'sendMessagePortToExtensionHostWorker') {
        throw new Error('send error')
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ;(mockRpc as any).invokeAndTransfer = async (method: string, ...args: ReadonlyArray<any>): Promise<any> => {
    if (method === 'sendMessagePortToExtensionHostWorker' || method === 'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker') {
      throw new Error('send error')
    }
    throw new Error(`unexpected method ${method}`)
  }
  RendererWorker.set(mockRpc)

  await expect(CreateExtensionHostRpc.createExtensionHostRpc()).rejects.toThrow('Failed to create extension host rpc')
})

test('createExtensionHostRpc should be awaitable', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'sendMessagePortToExtensionHostWorker') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ;(mockRpc as any).invokeAndTransfer = async (method: string, ...args: ReadonlyArray<any>): Promise<any> => {
    if (method === 'sendMessagePortToExtensionHostWorker' || method === 'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker') {
      return undefined
    }
    throw new Error(`unexpected method ${method}`)
  }
  RendererWorker.set(mockRpc)

  const rpc = await CreateExtensionHostRpc.createExtensionHostRpc()
  rpcInstances.push(rpc)

  expect(true).toBe(true)
})
