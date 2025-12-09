import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickProblems from '../src/parts/HandleClick/HandleClickProblems.ts'

test('handleClickProblems should call Layout.showPanel', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
    'Panel.selectIndex': async () => {},
  })

  await HandleClickProblems.handleClickProblems()

  expect(mockRpc.invocations.length).toBeGreaterThan(0)
  expect(mockRpc.invocations.some((inv) => inv.method === 'Layout.showPanel')).toBe(true)
})

test('handleClickProblems should call Panel.selectIndex with 1', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'Layout.showPanel': async () => {},
      'Panel.selectIndex': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'Layout.showPanel') {
        return undefined
      }
      if (method === 'Panel.selectIndex') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })

  await HandleClickProblems.handleClickProblems()

  expect(mockRpc.invocations.length).toBeGreaterThan(0)
  expect(mockRpc.invocations.some((inv) => inv.method === 'Panel.selectIndex' && inv.args[0] === 1)).toBe(true)
})

test('handleClickProblems should call Layout.showPanel and Panel.selectIndex in order', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'Layout.showPanel': async () => {},
      'Panel.selectIndex': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'Layout.showPanel') {
        return undefined
      }
      if (method === 'Panel.selectIndex') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })

  await HandleClickProblems.handleClickProblems()

  expect(mockRpc.invocations.length).toBeGreaterThan(0)
  const methods = mockRpc.invocations.map((inv) => inv.method)
  expect(methods).toEqual(['Layout.showPanel', 'Panel.selectIndex'])
})
