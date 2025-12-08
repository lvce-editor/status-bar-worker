import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostManagement from '../src/parts/ExtensionHostManagement/ExtensionHostManagement.ts'

test('activateByEvent should call RendererWorker.activateByEvent with correct event', async () => {
  let calledEvent: string | undefined
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method === 'ExtensionHostManagement.activateByEvent') {
        calledEvent = args[0]
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)

  await ExtensionHostManagement.activateByEvent('test.event')

  expect(calledEvent).toBe('test.event')
})

test('activateByEvent should handle different event names', async () => {
  let calledEvent: string | undefined
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method === 'ExtensionHostManagement.activateByEvent') {
        calledEvent = args[0]
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)

  await ExtensionHostManagement.activateByEvent('onDidChangeStatusBarItems')

  expect(calledEvent).toBe('onDidChangeStatusBarItems')
})

test('activateByEvent should be awaitable', async () => {
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'activateByEvent' || method === 'ExtensionHostManagement.activateByEvent') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)

  await ExtensionHostManagement.activateByEvent('test.event')

  expect(true).toBe(true)
})
