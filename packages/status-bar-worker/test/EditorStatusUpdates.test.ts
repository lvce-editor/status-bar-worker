import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

const queueCommands = jest.fn<() => Promise<number>>().mockResolvedValue(17)
beforeEach(() => {
  queueCommands.mockReset().mockResolvedValue(17)
  const rpc = createMockRpc({
    commandMap: {
      'Viewlet.queueCommands': queueCommands,
      'Viewlet.sendMultiple': jest.fn(),
    },
  })
  RendererProcess.set(Object.assign(rpc, { dispose: jest.fn() }))
})

const { createDefaultState } = await import('../src/parts/CreateDefaultState/CreateDefaultState.ts')
const EditorStatusState = await import('../src/parts/EditorStatusState/EditorStatusState.ts')
const { handleEditorStatusChangedAll } = await import('../src/parts/HandleEditorStatusChangedAll/HandleEditorStatusChangedAll.ts')
const StatusBarStates = await import('../src/parts/StatusBarStates/StatusBarStates.ts')
const { setComponentState } = await import('../src/parts/SetComponentState/SetComponentState.ts')

const status = { column: 1, encoding: 'utf8', endOfLine: 'lf', insertSpaces: true, languageId: 'json', line: 1, tabSize: 2 }

afterEach(async () => {
  EditorStatusState.reset()
  await RendererProcessRegistry.dispose()
})

test('partial updates merge into the authoritative snapshot before a view exists', async () => {
  await handleEditorStatusChangedAll(status)
  await handleEditorStatusChangedAll({ column: 7 })
  expect(EditorStatusState.get()).toEqual({ ...status, column: 7 })
  await handleEditorStatusChangedAll(undefined)
  expect(EditorStatusState.get()).toBeUndefined()
  await expect(handleEditorStatusChangedAll({ column: 8 })).rejects.toThrow('complete status')
})

test('live state metadata cannot change the editor baseline', async () => {
  const uid = 601
  const initial = { ...createDefaultState(), initial: false, uid }
  StatusBarStates.set(uid, initial, initial)
  await handleEditorStatusChangedAll(status)
  const { newState } = StatusBarStates.get(uid)
  const items = newState.statusBarItemsRight.map((item) => ({ ...item, elements: [{ type: 'text' as const, value: 'custom' }] }))
  await setComponentState(uid, { ...newState, editorStatus: { ...status, encoding: 'edited metadata' }, statusBarItemsRight: items })
  await handleEditorStatusChangedAll({ column: 2 })
  expect(StatusBarStates.get(uid).newState.statusBarItemsRight[2]).toBe(items[2])
  await handleEditorStatusChangedAll({ ...status, column: 2 })
  expect(StatusBarStates.get(uid).newState.statusBarItemsRight[2]).toBe(items[2])
})

test('all instances update before rendering awaits and delayed rendering cannot restore live edits', async () => {
  for (const uid of [602, 603]) {
    const initial = { ...createDefaultState(), initial: false, uid }
    StatusBarStates.set(uid, initial, initial)
  }
  await handleEditorStatusChangedAll(status)
  const gate = Promise.withResolvers<number>()
  queueCommands.mockReturnValue(gate.promise)
  const pending = handleEditorStatusChangedAll({ column: 9 })
  expect(StatusBarStates.get(603).newState.editorStatus?.column).toBe(9)
  const { newState } = StatusBarStates.get(603)
  const items = newState.statusBarItemsRight.map((item) => ({ ...item, elements: [{ type: 'text' as const, value: 'live edit' }] }))
  await setComponentState(603, { ...newState, statusBarItemsRight: items })
  gate.resolve(18)
  await pending
  expect(StatusBarStates.get(603).newState.statusBarItemsRight).toBe(items)
})

test('accepts legacy snapshots without line ending and indentation mode', async () => {
  await handleEditorStatusChangedAll({ column: 1, encoding: 'utf8', languageId: 'json', line: 1, tabSize: 2 })
  expect(EditorStatusState.get()).toEqual(status)
})
