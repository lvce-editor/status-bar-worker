import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostManagement from '../src/parts/ExtensionHostManagement/ExtensionHostManagement.ts'

test('activateByEvent should call ExtensionManagementWorker.activateByEvent with correct event', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
  })

  await ExtensionHostManagement.activateByEvent('test.event', '', 0)

  expect(mockRpc.invocations).toEqual([['Extensions.activateByEvent', 'test.event', '', 0]])
})

test('activateByEvent should handle different event names', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
  })

  await ExtensionHostManagement.activateByEvent('onDidChangeStatusBarItems', '', 0)

  expect(mockRpc.invocations).toEqual([['Extensions.activateByEvent', 'onDidChangeStatusBarItems', '', 0]])
})

test('activateByEvent should be awaitable', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
  })

  await ExtensionHostManagement.activateByEvent('test.event', '', 0)

  expect(mockRpc.invocations).toEqual([['Extensions.activateByEvent', 'test.event', '', 0]])
})
