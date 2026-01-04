import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostManagement from '../src/parts/ExtensionHostManagement/ExtensionHostManagement.ts'

test('activateByEvent should call RendererWorker.activateByEvent with correct event', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  await ExtensionHostManagement.activateByEvent('test.event', '', 0)

  expect(mockRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', 'test.event']])
})

test('activateByEvent should handle different event names', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  await ExtensionHostManagement.activateByEvent('onDidChangeStatusBarItems', '', 0)

  expect(mockRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', 'onDidChangeStatusBarItems']])
})

test('activateByEvent should be awaitable', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  await ExtensionHostManagement.activateByEvent('test.event', '', 0)

  expect(mockRpc.invocations).toEqual([['ExtensionHostManagement.activateByEvent', 'test.event']])
})
