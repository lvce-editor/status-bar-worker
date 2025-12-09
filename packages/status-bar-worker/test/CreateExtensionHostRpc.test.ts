import { expect, test, afterEach } from '@jest/globals'
import { type Rpc } from '@lvce-editor/rpc'
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
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker': async () => {},
    },
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

  const rpc = await CreateExtensionHostRpc.createExtensionHostRpc()
  rpcInstances.push(rpc)

  expect(rpc).toBeDefined()
  expect(typeof rpc).toBe('object')
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})

test('createExtensionHostRpc should use sendMessagePortToExtensionHostWorker', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker': async () => {},
    },
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

  const rpc = await CreateExtensionHostRpc.createExtensionHostRpc()
  rpcInstances.push(rpc)

  expect(rpc).toBeDefined()
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})

test('createExtensionHostRpc should handle errors and wrap in VError', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker': async () => {},
    },
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

  await expect(CreateExtensionHostRpc.createExtensionHostRpc()).rejects.toThrow('Failed to create extension host rpc')
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})

test('createExtensionHostRpc should be awaitable', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker': async () => {},
    },
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

  const rpc = await CreateExtensionHostRpc.createExtensionHostRpc()
  rpcInstances.push(rpc)

  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})
