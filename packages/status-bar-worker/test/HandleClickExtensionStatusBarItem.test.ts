import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickExtensionStatusBarItem from '../src/parts/HandleClickExtensionStatusBarItem/HandleClickExtensionStatusBarItem.ts'

test('handleClickExtensionStatusBarItem should invoke Extensions.executeCommand', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeCommand': async () => {},
  })

  await HandleClickExtensionStatusBarItem.handleClickExtensionStatusBarItem('test-command')

  expect(mockRpc.invocations).toEqual([['Extensions.executeCommand', 'test-command']])
})

test('handleClickExtensionStatusBarItem should pass command name to RPC', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeCommand': async () => {},
  })

  await HandleClickExtensionStatusBarItem.handleClickExtensionStatusBarItem('my-custom-command')

  expect(mockRpc.invocations).toEqual([['Extensions.executeCommand', 'my-custom-command']])
})
