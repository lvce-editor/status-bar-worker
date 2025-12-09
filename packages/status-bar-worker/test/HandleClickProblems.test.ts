import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickProblems from '../src/parts/HandleClick/HandleClickProblems.ts'

test('handleClickProblems should call Layout.showPanel', async () => {
  let showPanelCalled = false
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'Layout.showPanel') {
        showPanelCalled = true
        return undefined
      }
      if (method === 'Panel.selectIndex') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)

  await HandleClickProblems.handleClickProblems()

  expect(showPanelCalled).toBe(true)
})

test('handleClickProblems should call Panel.selectIndex with 1', async () => {
  let selectIndexCalled = false
  let selectIndexArg: number | undefined
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'Layout.showPanel') {
        return undefined
      }
      if (method === 'Panel.selectIndex') {
        selectIndexCalled = true
        selectIndexArg = args[0]
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)

  await HandleClickProblems.handleClickProblems()

  expect(selectIndexCalled).toBe(true)
  expect(selectIndexArg).toBe(1)
})

test('handleClickProblems should call Layout.showPanel and Panel.selectIndex in order', async () => {
  const callOrder: string[] = []
  const mockRpc = MockRpc.create({
    commandMap: {},
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'Layout.showPanel') {
        callOrder.push('Layout.showPanel')
        return undefined
      }
      if (method === 'Panel.selectIndex') {
        callOrder.push('Panel.selectIndex')
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })
  RendererWorker.set(mockRpc)

  await HandleClickProblems.handleClickProblems()

  expect(callOrder).toEqual(['Layout.showPanel', 'Panel.selectIndex'])
})
