import { expect, test, afterEach } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as Initialize from '../src/parts/Initialize/Initialize.ts'

afterEach(() => {
  ExtensionHost.registerMockRpc({
    commandMap: {},
    invoke: () => {
      throw new Error('ExtensionHost not set in test')
    },
  })
})

test('initialize should create extension host rpc and set it', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
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
  ;(mockRendererRpc as any).invokeAndTransfer = async (method: string, ...args: ReadonlyArray<any>): Promise<any> => {
    if (method === 'sendMessagePortToExtensionHostWorker' || method === 'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionHostWorker') {
      return undefined
    }
    throw new Error(`unexpected method ${method}`)
  }

  await Initialize.initialize()

  expect(mockRendererRpc.invocations.length).toBeGreaterThan(0)
})
