import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostShared from '../src/parts/ExtensionHost/ExtensionHostShared.ts'

const combineResults = (results: readonly any[]): any => {
  return results
}

test('executeProviders should activate by event and invoke method with params', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'test.method': async () => 'test-result',
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
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'test.method': async () => 'result',
  })

  const result = await ExtensionHostShared.executeProviders({
    combineResults,
    event: 'test.event',
    method: 'test.method',
    noProviderFoundResult: null,
    params: [],
  })

  expect(mockRendererRpc.invocations).toEqual([
    {
      method: 'ExtensionHostManagement.activateByEvent',
      args: ['test.event'],
    },
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([
    {
      method: 'test.method',
      args: [],
    },
  ])
  expect(result).toBe('result')
})

test('executeProvider should activate by event and invoke method with params', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'test.method': async () => 'test-result',
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
    'test.method': async () => undefined,
  })

  await ExtensionHostShared.execute({
    method: 'test.method',
    params: ['param1', 'param2'],
  })

  expect(mockExtensionHostRpc.invocations).toEqual([
    {
      method: 'test.method',
      args: ['param1', 'param2'],
    },
  ])
})

test('execute should handle empty params', async () => {
  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'test.method': async () => undefined,
  })

  await ExtensionHostShared.execute({
    method: 'test.method',
    params: [],
  })

  expect(mockExtensionHostRpc.invocations).toEqual([
    {
      method: 'test.method',
      args: [],
    },
  ])
})
