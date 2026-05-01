import { expect, test } from '@jest/globals'
import * as GetBuiltinStatusBarItems from '../src/parts/GetBuiltinStatusBarItems/GetBuiltinStatusBarItems.ts'

test('getBuiltinStatusBarItems should return all builtin items by default', async () => {
  const result = await GetBuiltinStatusBarItems.getBuiltinStatusBarItems(0, 0)

  expect(result).toEqual([
    {
      ariaLabel: 'Notifications',
      command: '',
      elements: [{ type: 'text', value: 'Notifications' }],
      name: 'Notifications',
      tooltip: 'Notifications',
    },
    {
      ariaLabel: 'No Problems',
      command: '',
      elements: [
        { type: 'icon', value: 'ProblemsErrorIcon' },
        { type: 'text', value: '0' },
        { type: 'icon', value: 'ProblemsWarningIcon' },
        { type: 'text', value: '0' },
      ],
      name: 'Problems',
      tooltip: 'Problems',
    },
  ])
})

test('getBuiltinStatusBarItems should omit notifications when disabled', async () => {
  const result = await GetBuiltinStatusBarItems.getBuiltinStatusBarItems(1, 2, {
    notificationsEnabled: false,
  })

  expect(result).toEqual([
    {
      ariaLabel: '1 Problem, 2 Warnings',
      command: '',
      elements: [
        { type: 'icon', value: 'ProblemsErrorIcon' },
        { type: 'text', value: '1' },
        { type: 'icon', value: 'ProblemsWarningIcon' },
        { type: 'text', value: '2' },
      ],
      name: 'Problems',
      tooltip: 'Problems',
    },
  ])
})

test('getBuiltinStatusBarItems should omit problems when disabled', async () => {
  const result = await GetBuiltinStatusBarItems.getBuiltinStatusBarItems(1, 2, {
    problemsEnabled: false,
  })

  expect(result).toEqual([
    {
      ariaLabel: 'Notifications',
      command: '',
      elements: [{ type: 'text', value: 'Notifications' }],
      name: 'Notifications',
      tooltip: 'Notifications',
    },
  ])
})

test('getBuiltinStatusBarItems should return empty array when all builtin items are disabled', async () => {
  const result = await GetBuiltinStatusBarItems.getBuiltinStatusBarItems(1, 2, {
    notificationsEnabled: false,
    problemsEnabled: false,
  })

  expect(result).toEqual([])
})
