import { expect, test, afterEach } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostStatusBarItems from '../src/parts/ExtensionHost/ExtensionHostStatusBarItems.ts'
import * as ExtensionHostActivationEvent from '../src/parts/ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../src/parts/ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as Listener from '../src/parts/Listener/Listener.ts'

afterEach(() => {
  for (const id in Listener.state) {
    delete Listener.state[id]
  }
  ExtensionHostStatusBarItems.state.changeListeners.length = 0
})

test('getStatusBarItems should activate by event and invoke GetStatusBarItems', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
      {
        id: 'item1',
        text: 'Item 1',
      },
    ],
  })

  const result = await ExtensionHostStatusBarItems.getStatusBarItems()

  expect(mockRendererRpc.invocations.length).toBeGreaterThan(0)
  expect(mockRendererRpc.invocations.some((inv) => inv.method === 'activateByEvent' || inv.method.endsWith('.activateByEvent'))).toBe(true)
  expect(mockExtensionHostRpc.invocations.length).toBeGreaterThan(0)
  expect(mockExtensionHostRpc.invocations.some((inv) => inv.method === ExtensionHostCommandType.GetStatusBarItems)).toBe(true)
  expect(result).toEqual([
    {
      id: 'item1',
      text: 'Item 1',
    },
  ])
})

test('getStatusBarItems should return empty array when no items are returned', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [],
  })

  const result = await ExtensionHostStatusBarItems.getStatusBarItems()

  expect(mockRendererRpc.invocations.length).toBeGreaterThan(0)
  expect(mockExtensionHostRpc.invocations.length).toBeGreaterThan(0)
  expect(result).toEqual([])
})

test('getStatusBarItems should return items from provider', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
      {
        id: 'item1',
        text: 'Item 1',
      },
      {
        id: 'item2',
        text: 'Item 2',
      },
    ],
  })

  const result = await ExtensionHostStatusBarItems.getStatusBarItems()

  expect(mockRendererRpc.invocations.length).toBeGreaterThan(0)
  expect(mockExtensionHostRpc.invocations.length).toBeGreaterThan(0)
  expect(result).toEqual([
    {
      id: 'item1',
      text: 'Item 1',
    },
    {
      id: 'item2',
      text: 'Item 2',
    },
  ])
})

const emptyListener = (): void => {}
const listener2 = (): void => {}

test('onChange should register a listener and call RegisterStatusBarChangeListener', async () => {
  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.RegisterStatusBarChangeListener]: async () => undefined,
  })

  await ExtensionHostStatusBarItems.onChange(emptyListener)

  expect(mockExtensionHostRpc.invocations.length).toBeGreaterThan(0)
  const invocation = mockExtensionHostRpc.invocations.find((inv) => inv.method === ExtensionHostCommandType.RegisterStatusBarChangeListener)
  expect(invocation).toBeDefined()
  expect(invocation?.args.length).toBe(1)
  expect(typeof invocation?.args[0]).toBe('number')
  expect(Listener.state[invocation!.args[0]]).toBe(emptyListener)
})

test('onChange should register multiple listeners independently', async () => {
  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.RegisterStatusBarChangeListener]: async () => undefined,
  })

  await ExtensionHostStatusBarItems.onChange(emptyListener)
  await ExtensionHostStatusBarItems.onChange(listener2)

  const invocations = mockExtensionHostRpc.invocations.filter((inv) => inv.method === ExtensionHostCommandType.RegisterStatusBarChangeListener)
  expect(invocations.length).toBe(2)
  expect(invocations[0].args[0]).not.toBe(invocations[1].args[0])
  expect(Listener.state[invocations[0].args[0]]).toBe(emptyListener)
  expect(Listener.state[invocations[1].args[0]]).toBe(listener2)
})

test('onChange should pass empty params array to executeProviders', async () => {
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
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [],
  })

  await ExtensionHostStatusBarItems.getStatusBarItems()

  expect(mockRendererRpc.invocations.length).toBeGreaterThan(0)
  expect(mockExtensionHostRpc.invocations.length).toBeGreaterThan(0)
  const invocation = mockExtensionHostRpc.invocations.find((inv) => inv.method === ExtensionHostCommandType.GetStatusBarItems)
  expect(invocation?.args).toEqual([])
})
