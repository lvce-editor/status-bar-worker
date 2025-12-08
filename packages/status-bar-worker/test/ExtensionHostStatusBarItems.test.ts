import { expect, test, afterEach } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
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
  let activatedEvent: string | undefined
  let invokedMethod: string | undefined

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
      return [
        {
          id: 'item1',
          text: 'Item 1',
        },
      ]
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await ExtensionHostStatusBarItems.getStatusBarItems()

  expect(activatedEvent).toBe(ExtensionHostActivationEvent.OnStatusBarItem)
  expect(invokedMethod).toBe(ExtensionHostCommandType.GetStatusBarItems)
  expect(result).toEqual([
    {
      id: 'item1',
      text: 'Item 1',
    },
  ])
})

test('getStatusBarItems should return empty array when no items are returned', async () => {
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
    invoke: (method: string) => {
      if (method === ExtensionHostCommandType.GetStatusBarItems) {
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await ExtensionHostStatusBarItems.getStatusBarItems()

  expect(result).toEqual([])
})

test('getStatusBarItems should return items from provider', async () => {
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
    invoke: (method: string) => {
      if (method === ExtensionHostCommandType.GetStatusBarItems) {
        return [
          {
            id: 'item1',
            text: 'Item 1',
          },
          {
            id: 'item2',
            text: 'Item 2',
          },
        ]
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  const result = await ExtensionHostStatusBarItems.getStatusBarItems()

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

  await ExtensionHostStatusBarItems.onChange(emptyListener)

  expect(invokedMethod).toBe(ExtensionHostCommandType.RegisterStatusBarChangeListener)
  expect(invokedParams).toBeDefined()
  expect(invokedParams?.length).toBe(1)
  expect(typeof invokedParams?.[0]).toBe('number')
  expect(Listener.state[invokedParams![0]]).toBe(emptyListener)
})

test('onChange should register multiple listeners independently', async () => {
  let invokedCount = 0
  const listenerIds: number[] = []

  const mockExtensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === ExtensionHostCommandType.RegisterStatusBarChangeListener) {
        invokedCount++
        listenerIds.push(args[0])
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  await ExtensionHostStatusBarItems.onChange(emptyListener)
  await ExtensionHostStatusBarItems.onChange(listener2)

  expect(invokedCount).toBe(2)
  expect(listenerIds.length).toBe(2)
  expect(listenerIds[0]).not.toBe(listenerIds[1])
  expect(Listener.state[listenerIds[0]]).toBe(emptyListener)
  expect(Listener.state[listenerIds[1]]).toBe(listener2)
})

test('onChange should pass empty params array to executeProviders', async () => {
  let invokedParams: ReadonlyArray<any> | undefined

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
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === ExtensionHostCommandType.GetStatusBarItems) {
        invokedParams = args
        return []
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  ExtensionHost.set(mockExtensionHostRpc)

  await ExtensionHostStatusBarItems.getStatusBarItems()

  expect(invokedParams).toEqual([])
})
