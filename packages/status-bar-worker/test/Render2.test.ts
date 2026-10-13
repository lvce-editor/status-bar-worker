import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

const item = (value: string): StatusBarItem => ({ ariaLabel: value, elements: [{ type: 'text', value }], name: 'cursor', tooltip: value })

test('render2 returns renderer commands when no direct renderer is connected', async () => {
  const uid = 1
  const oldState = createDefaultState()
  const newState = { ...oldState, initial: false, uid }
  StatusBarStates.set(uid, oldState, newState)

  const result = await Render2.render2(uid, [DiffType.RenderItems])
  expect(result[0][0]).toBe('Viewlet.setDom2')
  expect(result[0][1]).toBe(uid)
})

test('render2 queues renderer commands and returns a lightweight commit marker', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 17)
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands } }))
  const uid = 2
  const oldState = createDefaultState()
  const newState = { ...oldState, initial: false, uid }
  StatusBarStates.set(uid, oldState, newState)

  const result = await Render2.render2(uid, [DiffType.RenderItems])

  expect(queueCommands).toHaveBeenCalledWith(uid, [expect.arrayContaining(['Viewlet.setDom2', uid])])
  expect(result).toEqual([['Viewlet.commitPending', uid, 17]])
})

test('render2 advances the snapshot for repeated out-of-band changes and reversions', async () => {
  const uid = 10
  const queued: (readonly any[])[] = []
  const queueCommands = jest.fn((_uid: number, commands: readonly any[]) => {
    queued.push(commands)
    return queued.length
  })
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands } }))
  const initial = { ...createDefaultState(), uid }
  StatusBarStates.set(uid, initial, { ...initial, initial: false, statusBarItemsRight: [item('Col 1')] })
  await Render2.render2(uid, [DiffType.RenderIncremental])
  for (const value of ['Col 2', 'Col 1', 'Col 3']) {
    const { newState, oldState } = StatusBarStates.get(uid)
    StatusBarStates.set(uid, oldState, { ...newState, statusBarItemsRight: [item(value)] })
    await Render2.render2(uid, [])
    const commands = queued.at(-1)!
    expect(commands[0][0]).toBe('Viewlet.setPatches')
    expect(commands[0][2]).toContainEqual(expect.objectContaining({ value }))
  }
})

test('render2 does not apply old-tree patches after a full replacement', async () => {
  const uid = 11
  const queueCommands = jest.fn((_uid: number, _commands: readonly any[]) => 1)
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands } }))
  const oldState = { ...createDefaultState(), initial: false, uid }
  const item = { ariaLabel: 'New', elements: [{ type: 'text' as const, value: 'New' }], name: 'new', tooltip: '' }
  StatusBarStates.set(uid, oldState, { ...oldState, statusBarItemsRight: [item] })
  await Render2.render2(uid, [DiffType.RenderItems])
  expect(queueCommands.mock.calls[0][1]).toHaveLength(1)
  expect(queueCommands.mock.calls[0][1][0][0]).toBe('Viewlet.setDom2')
})
