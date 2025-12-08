import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostShared from '../src/parts/ExtensionHost/ExtensionHostShared.ts'

const combineResults = (results: readonly any[]): any => {
  return results
}

test('executeProviders should activate by event and invoke method with params', async () => {
  let activatedEvent: string | undefined
  let invokedMethod: string | undefined
  let invokedParams: ReadonlyArray<any> | undefined

  const mockRendererRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        activatedEvent = args[0]
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRendererRpc)

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      invokedMethod = method
      invokedParams = args
      return 'test-result'
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await ExtensionHostShared.executeProviders({
    combineResults,
    event: 'test.event',
    method: 'test.method',
    noProviderFoundMessage: 'No provider',
    noProviderFoundResult: null,
    params: ['param1', 'param2'],
  })

  expect(activatedEvent).toBe('test.event')
  expect(invokedMethod).toBe('test.method')
  expect(invokedParams).toEqual(['param1', 'param2'])
  expect(result).toBe('test-result')
})

test('executeProviders should use default noProviderFoundMessage', async () => {
  const mockRendererRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRendererRpc)

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: () => {
      return 'result'
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await ExtensionHostShared.executeProviders({
    combineResults,
    event: 'test.event',
    method: 'test.method',
    noProviderFoundResult: null,
    params: [],
  })

  expect(result).toBe('result')
})

test('executeProvider should activate by event and invoke method with params', async () => {
  let activatedEvent: string | undefined
  let invokedMethod: string | undefined
  let invokedParams: ReadonlyArray<any> | undefined

  const mockRendererRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method.endsWith('.activateByEvent')) {
        activatedEvent = args[0]
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRendererRpc)

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      invokedMethod = method
      invokedParams = args
      return 'test-result'
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await ExtensionHostShared.executeProvider({
    event: 'test.event',
    method: 'test.method',
    noProviderFoundMessage: 'No provider',
    params: ['param1', 'param2'],
  })

  expect(activatedEvent).toBe('test.event')
  expect(invokedMethod).toBe('test.method')
  expect(invokedParams).toEqual(['param1', 'param2'])
  expect(result).toBe('test-result')
})

test('execute should invoke method with params', async () => {
  let invokedMethod: string | undefined
  let invokedParams: ReadonlyArray<any> | undefined

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      invokedMethod = method
      invokedParams = args
      return undefined
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  await ExtensionHostShared.execute({
    method: 'test.method',
    params: ['param1', 'param2'],
  })

  expect(invokedMethod).toBe('test.method')
  expect(invokedParams).toEqual(['param1', 'param2'])
})

test('execute should handle empty params', async () => {
  let invokedMethod: string | undefined
  let invokedParams: ReadonlyArray<any> | undefined

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      invokedMethod = method
      invokedParams = args
      return undefined
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  await ExtensionHostShared.execute({
    method: 'test.method',
    params: [],
  })

  expect(invokedMethod).toBe('test.method')
  expect(invokedParams).toEqual([])
})
