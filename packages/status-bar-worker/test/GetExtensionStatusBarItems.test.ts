import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { getExtensionStatusBarItems } from '../src/parts/GetExtensionStatusBarItems/GetExtensionStatusBarItems.ts'

test('getExtensionStatusBarItems activates isolated providers and gets their items', async () => {
  using mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getStatusBarItems': async () => [{ id: 'test', text: 'Test' }],
  })

  const result = await getExtensionStatusBarItems('/test', 1)

  expect(mockExtensionManagementRpc.invocations).toEqual([
    ['Extensions.activateByEvent', 'onStatusBarItem', '/test', 1],
    ['Extensions.getStatusBarItems'],
  ])
  expect(result).toEqual([{ id: 'test', text: 'Test' }])
})
