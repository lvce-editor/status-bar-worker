import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleNotificationCountChangedAll } from '../src/parts/HandleNotificationCountChangedAll/HandleNotificationCountChangedAll.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('renders notification count changes through the viewlet command pipeline', async () => {
  const state = createDefaultState()
  StatusBarStates.set(42, state, state)
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'Viewlet.executeViewletCommand': async () => {},
  })

  await handleNotificationCountChangedAll(3)

  expect(mockRendererRpc.invocations).toEqual([['Viewlet.executeViewletCommand', 42, 'handleNotificationCountChanged', 3]])
})
