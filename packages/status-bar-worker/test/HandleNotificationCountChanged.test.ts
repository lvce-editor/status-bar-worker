import { expect, test } from '@jest/globals'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleNotificationCountChanged } from '../src/parts/HandleNotificationCountChanged/HandleNotificationCountChanged.ts'

const notificationItem: StatusBarItem = {
  ariaLabel: 'No Notifications',
  command: '',
  elements: [{ type: 'icon', value: 'NotificationBellIcon' }],
  name: 'Notifications',
  tooltip: 'No Notifications',
}

const problemsItem: StatusBarItem = {
  ariaLabel: 'No Problems',
  command: '',
  elements: [{ type: 'icon', value: 'error' }],
  name: 'Problems',
  tooltip: 'No Problems',
}

test('updates the notification item and preserves other right-side items', () => {
  const state = { ...createDefaultState(), statusBarItemsRight: [notificationItem, problemsItem] }
  const result = handleNotificationCountChanged(state, 2)
  expect(result.statusBarItemsRight).toEqual([
    {
      ariaLabel: '2 Notifications',
      command: '',
      elements: [
        { type: 'icon', value: 'NotificationBellIcon' },
        { type: 'text', value: '2' },
      ],
      name: 'Notifications',
      tooltip: '2 Notifications',
    },
    problemsItem,
  ])
})

test('returns the same state when notifications are disabled', () => {
  const state = { ...createDefaultState(), statusBarItemsRight: [problemsItem] }
  expect(handleNotificationCountChanged(state, 2)).toBe(state)
})
