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

test('provider activation and lookup stay within each owning application', async () => {
  using rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.invokeForApplication': async (applicationId: string, method: string) =>
      method === 'Extensions.getStatusBarItems' ? [{ text: applicationId }] : undefined,
  })
  expect(await getExtensionStatusBarItems('/test', 1, 'preview')).toEqual([{ text: 'preview' }])
  expect(await getExtensionStatusBarItems('/test', 1, 'source')).toEqual([{ text: 'source' }])
  expect(rpc.invocations).toEqual([
    ['Extensions.invokeForApplication', 'preview', 'Extensions.activateByEvent', 'onStatusBarItem', '/test', 1],
    ['Extensions.invokeForApplication', 'preview', 'Extensions.getStatusBarItems'],
    ['Extensions.invokeForApplication', 'source', 'Extensions.activateByEvent', 'onStatusBarItem', '/test', 1],
    ['Extensions.invokeForApplication', 'source', 'Extensions.getStatusBarItems'],
  ])
})
