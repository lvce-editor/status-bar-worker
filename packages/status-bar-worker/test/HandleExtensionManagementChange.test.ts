import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleExtensionManagementChange } from '../src/parts/HandleExtensionManagementChange/HandleExtensionManagementChange.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('renders extension item changes through the viewlet command pipeline', async () => {
  const state = createDefaultState()
  StatusBarStates.set(42, state, state)
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Viewlet.executeViewletCommand': async () => {},
  })

  await handleExtensionManagementChange()

  expect(mockRendererRpc.invocations).toEqual([['Viewlet.executeViewletCommand', 42, 'handleItemsChanged']])
})
