import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getNotificationsStatusBarItem } from '../src/parts/GetNotificationsStatusBarItem/GetNotificationsStatusBarItem.ts'
import { getStatusBarItemElementVirtualDom } from '../src/parts/GetStatusBarItemElementVirtualDom/GetStatusBarItemElementVirtualDom.ts'
import { getStatusBarItems } from '../src/parts/GetStatusBarItems/GetStatusBarItems.ts'
import { handleClickEditorStatus } from '../src/parts/HandleClickEditorStatus/HandleClickEditorStatus.ts'
import { handleNotificationCountChanged } from '../src/parts/HandleNotificationCountChanged/HandleNotificationCountChanged.ts'
import { handleProblemsSummaryChange } from '../src/parts/HandleProblemsSummaryChange/HandleProblemsSummaryChange.ts'
import { handleUpdateProgress } from '../src/parts/HandleUpdateProgress/HandleUpdateProgress.ts'
import { toUiStatusBarItem } from '../src/parts/ToUiStatusBarItem/ToUiStatusBarItem.ts'

test('extension items use the legacy name or an empty name when no id is provided', () => {
  expect(toUiStatusBarItem({ name: 'legacy' }).name).toBe('legacy')
  expect(toUiStatusBarItem({})).toEqual({ ariaLabel: '', command: '', icon: '', name: '', text: '', tooltip: '' })
})

test('a single notification has a singular label and visible count', () => {
  expect(getNotificationsStatusBarItem(true, 1)).toEqual([
    {
      ariaLabel: '1 Notification',
      command: '',
      elements: [
        { type: 'icon', value: 'NotificationBellIcon' },
        { type: 'text', value: '1' },
      ],
      name: 'Notifications',
      tooltip: '1 Notification',
    },
  ])
})

test('hidden status items do not query extensions', async () => {
  using rpc = ExtensionManagementWorker.registerMockRpc({})
  expect(await getStatusBarItems({ assetDir: '', errorCount: 0, platform: 0, showItems: false, warningCount: 0 })).toEqual([])
  expect(rpc.invocations).toEqual([])
})

test('builtin items are enabled by default', async () => {
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.activateByEvent': async () => {},
    'Extensions.getNotificationCount': async () => 1,
    'Extensions.getStatusBarItems': async () => [],
  })
  const items = await getStatusBarItems({ assetDir: '', errorCount: 2, platform: 0, showItems: true, warningCount: 3 })
  expect(items.map((item) => item.name)).toEqual(['Notifications', 'Problems'])
  expect(items[0].ariaLabel).toBe('1 Notification')
})

test('clicking editor status without an active editor does not open a widget', async () => {
  using rpc = RendererWorker.registerMockRpc({})
  await handleClickEditorStatus('EditorPosition', undefined)
  expect(rpc.invocations).toEqual([])
})

test('notification changes preserve state when notifications are disabled', () => {
  const state = createDefaultState()
  expect(handleNotificationCountChanged(state, 5)).toBe(state)
})

test('problem updates preserve unrelated extension items', () => {
  const item = { ariaLabel: 'extension', command: '', elements: [], name: 'extension', tooltip: '' }
  const state = { ...createDefaultState(), statusBarItemsLeft: [item] }
  const result = handleProblemsSummaryChange(state, { errorCount: 2, hasEditor: true, warningCount: 3 })
  expect(result.errorCount).toBe(2)
  expect(result.warningCount).toBe(3)
  expect(result.statusBarItemsLeft).toEqual([item])
  expect(result.statusBarItemsLeft[0]).toBe(item)
})

test('spinning extension icons retain their animation class and target name', () => {
  const [node] = getStatusBarItemElementVirtualDom({ spinning: true, type: 'icon', value: 'LoadingIcon' }, 'extension')
  expect(node.name).toBe('extension')
  expect(node.className).toBe('MaskIcon StatusBarIcon LoadingIcon Spinning')
})

test('renders determinate status bar progress with native progress semantics', () => {
  expect(
    getStatusBarItemElementVirtualDom({ ariaLabel: 'Update download progress', max: 1, type: 'progress', value: 0.9 }, 'update-progress'),
  ).toEqual([
    {
      ariaLabel: 'Update download progress',
      className: 'StatusBarItemProgress',
      max: 1,
      name: 'update-progress',
      type: expect.any(Number),
      value: 0.9,
    },
  ])
})

test('renders unknown download totals as indeterminate and clears terminal progress', () => {
  const state = createDefaultState()
  const indeterminate = handleUpdateProgress(state, undefined)
  expect(indeterminate.statusBarItemsLeft[0].elements[1]).toEqual({ ariaLabel: 'Update download progress', max: 1, type: 'progress' })
  expect(handleUpdateProgress(indeterminate, null).statusBarItemsLeft).toEqual([])
})

test('updates the existing progress item without disturbing other status bar items', () => {
  const existingItem = { ariaLabel: 'Other item', elements: [{ type: 'text' as const, value: 'Ready' }], name: 'other', tooltip: 'Ready' }
  const initialState = { ...createDefaultState(), statusBarItemsLeft: [existingItem] }
  const firstUpdate = handleUpdateProgress(initialState, 0.2)
  const secondUpdate = handleUpdateProgress(firstUpdate, 1.2)
  expect(secondUpdate.statusBarItemsLeft).toHaveLength(2)
  expect(secondUpdate.statusBarItemsLeft[0]).toBe(existingItem)
  expect(secondUpdate.statusBarItemsLeft[1].elements[1]).toMatchObject({ type: 'progress', value: 1 })
})
