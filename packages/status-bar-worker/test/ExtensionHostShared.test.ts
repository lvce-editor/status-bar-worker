import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostShared from '../src/parts/ExtensionHost/ExtensionHostShared.ts'

const combineResults = (results: readonly any[]): any => {
  return results
}

test('executeProviders should activate by event and invoke method with params', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'ExtensionHostManagement.activateByEvent': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      return 'test-result'
    },
  })

  const result = await ExtensionHostShared.executeProviders({
    combineResults,
    event: 'test.event',
    method: 'test.method',
    noProviderFoundMessage: 'No provider',
    noProviderFoundResult: null,
    params: ['param1', 'param2'],
  })

  expect(mockRendererRpc.invocations.length).toBeGreaterThan(0)
  expect(mockRendererRpc.invocations.some((inv) => (inv.method === 'activateByEvent' || inv.method.endsWith('.activateByEvent')) && inv.args[0] === 'test.event')).toBe(true)
  expect(mockExtensionHostRpc.invocations.length).toBeGreaterThan(0)
  expect(mockExtensionHostRpc.invocations.some((inv) => inv.method === 'test.method' && inv.args[0] === 'param1' && inv.args[1] === 'param2')).toBe(true)
  expect(result).toBe('test-result')
})

test('executeProviders should use default noProviderFoundMessage', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'ExtensionHostManagement.activateByEvent': async () => {},
    },
    invoke: (method: string) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    commandMap: {
      'test.method': async () => {},
    },
    invoke: () => {
      return 'result'
    },
  })

  const result = await ExtensionHostShared.executeProviders({
    combineResults,
    event: 'test.event',
    method: 'test.method',
    noProviderFoundResult: null,
    params: [],
  })

  expect(mockRendererRpc.invocations.length).toBeGreaterThan(0)
  expect(mockExtensionHostRpc.invocations.length).toBeGreaterThan(0)
  expect(result).toBe('result')
})

test('executeProvider should activate by event and invoke method with params', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'ExtensionHostManagement.activateByEvent': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    commandMap: {
      'test.method': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      return 'test-result'
    },
  })

  const result = await ExtensionHostShared.executeProvider({
    event: 'test.event',
    method: 'test.method',
    noProviderFoundMessage: 'No provider',
    params: ['param1', 'param2'],
  })

  expect(mockRendererRpc.invocations.length).toBeGreaterThan(0)
  expect(mockRendererRpc.invocations.some((inv) => (inv.method === 'activateByEvent' || inv.method.endsWith('.activateByEvent')) && inv.args[0] === 'test.event')).toBe(true)
  expect(mockExtensionHostRpc.invocations.length).toBeGreaterThan(0)
  expect(mockExtensionHostRpc.invocations.some((inv) => inv.method === 'test.method' && inv.args[0] === 'param1' && inv.args[1] === 'param2')).toBe(true)
  expect(result).toBe('test-result')
})

test('execute should invoke method with params', async () => {
  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      return undefined
    },
  })

  await ExtensionHostShared.execute({
    method: 'test.method',
    params: ['param1', 'param2'],
  })

  expect(mockExtensionHostRpc.invocations.length).toBeGreaterThan(0)
  expect(mockExtensionHostRpc.invocations.some((inv) => inv.method === 'test.method' && inv.args[0] === 'param1' && inv.args[1] === 'param2')).toBe(true)
})

test('execute should handle empty params', async () => {
  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      return undefined
    },
  })

  await ExtensionHostShared.execute({
    method: 'test.method',
    params: [],
  })

  expect(mockExtensionHostRpc.invocations.length).toBeGreaterThan(0)
  expect(mockExtensionHostRpc.invocations.some((inv) => inv.method === 'test.method' && inv.args.length === 0)).toBe(true)
})
