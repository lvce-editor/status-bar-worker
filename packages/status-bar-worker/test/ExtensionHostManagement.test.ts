import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostManagement from '../src/parts/ExtensionHostManagement/ExtensionHostManagement.ts'

test('activateByEvent should call RendererWorker.activateByEvent with correct event', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'ExtensionHostManagement.activateByEvent': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method === 'ExtensionHostManagement.activateByEvent') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })

  await ExtensionHostManagement.activateByEvent('test.event')

  expect(mockRpc.invocations.length).toBeGreaterThan(0)
  expect(mockRpc.invocations.some((inv) => (inv.method === 'activateByEvent' || inv.method === 'ExtensionHostManagement.activateByEvent') && inv.args[0] === 'test.event')).toBe(true)
})

test('activateByEvent should handle different event names', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'ExtensionHostManagement.activateByEvent': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method === 'ExtensionHostManagement.activateByEvent') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })

  await ExtensionHostManagement.activateByEvent('onDidChangeStatusBarItems')

  expect(mockRpc.invocations.length).toBeGreaterThan(0)
  expect(mockRpc.invocations.some((inv) => (inv.method === 'activateByEvent' || inv.method === 'ExtensionHostManagement.activateByEvent') && inv.args[0] === 'onDidChangeStatusBarItems')).toBe(true)
})

test('activateByEvent should be awaitable', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'ExtensionHostManagement.activateByEvent': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method === 'ExtensionHostManagement.activateByEvent') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })

  await ExtensionHostManagement.activateByEvent('test.event')

  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})
