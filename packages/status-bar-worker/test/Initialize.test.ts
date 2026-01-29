import { expect, test, afterEach } from '@jest/globals'
import { type Rpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as Initialize from '../src/parts/Initialize/Initialize.ts'

const rpcInstances: Rpc[] = []

afterEach(() => {
  for (const rpc of rpcInstances) {
    if (rpc && typeof (rpc as any).dispose === 'function') {
      ;(rpc as any).dispose()
    }
  }
  rpcInstances.length = 0
  ExtensionHost.registerMockRpc({})
})

test('initialize should create extension host rpc and set it', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker': async () => {},
  })
  ;(mockRendererRpc as any).invokeAndTransfer = async (method: string, ...args: ReadonlyArray<any>): Promise<any> => {
    if (method === 'sendMessagePortToExtensionHostWorker' || method === 'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker') {
      return undefined
    }
    throw new Error(`unexpected method ${method}`)
  }

  const rpc = await Initialize.initialize()
  if (rpc) {
    rpcInstances.push(rpc)
  }

  expect(mockRendererRpc.invocations).toEqual([])
})
