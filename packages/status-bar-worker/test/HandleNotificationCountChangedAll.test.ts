import { afterEach, expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleNotificationCountChangedAll } from '../src/parts/HandleNotificationCountChangedAll/HandleNotificationCountChangedAll.ts'
import * as NotificationCount from '../src/parts/NotificationCount/NotificationCount.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

const notificationItem: StatusBarItem = {
  ariaLabel: 'No Notifications',
  command: '',
  elements: [{ type: 'icon', value: 'NotificationBellIcon' }],
  name: 'Notifications',
  tooltip: 'No Notifications',
}

afterEach(() => {
  NotificationCount.reset()
})

test('retains notification count changes before a status bar instance exists', async () => {
  await handleNotificationCountChangedAll(3)

  expect(NotificationCount.get()).toBe(3)
})

test('renders notification count changes through the direct renderer connection', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 17)
  const sendMultiple = jest.fn()
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands, 'Viewlet.sendMultiple': sendMultiple } }))
  const state = { ...createDefaultState(), initial: false, statusBarItemsRight: [notificationItem], uid: 42 }
  StatusBarStates.set(42, state, state)

  await handleNotificationCountChangedAll(3)

  expect(queueCommands).toHaveBeenCalledTimes(1)
  const [uid, commands] = queueCommands.mock.calls[0]
  expect(uid).toBe(42)
  expect((commands[0] as readonly unknown[])[0]).toBe('Viewlet.setDom2')
  expect(JSON.stringify(commands)).toContain('"ariaLabel":"3 Notifications"')
  expect(sendMultiple).toHaveBeenCalledWith([['Viewlet.commitPending', 42, 17]])
})
