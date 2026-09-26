import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickProblems from '../src/parts/HandleClickProblems/HandleClickProblems.ts'

test('handleClickProblems should call Layout.showPanel with Problems', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
  })

  await HandleClickProblems.handleClickProblems()

  expect(mockRpc.invocations).toEqual([['Layout.showPanel', 'Problems']])
})
