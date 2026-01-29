import { expect, test, beforeEach, vi } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClick from '../src/parts/HandleClick/HandleClick.ts'
import * as HandleClickExtensionStatusBarItem from '../src/parts/HandleClickExtensionStatusBarItem/HandleClickExtensionStatusBarItem.ts'
import * as HandleClickNotification from '../src/parts/HandleClickNotification/HandleClickNotification.ts'
import * as HandleClickProblems from '../src/parts/HandleClickProblems/HandleClickProblems.ts'

vi.mock('../src/parts/HandleClickNotification/HandleClickNotification.ts')
vi.mock('../src/parts/HandleClickProblems/HandleClickProblems.ts')
vi.mock('../src/parts/HandleClickExtensionStatusBarItem/HandleClickExtensionStatusBarItem.ts')

beforeEach(() => {
  vi.clearAllMocks()
})

test('handleClick should return state unchanged when name is empty', async () => {
  const state: StatusBarState = createDefaultState()
  const result = await HandleClick.handleClick(state, '')
  expect(result).toBe(state)
})

test('handleClick should return state unchanged when name is null', async () => {
  const state: StatusBarState = createDefaultState()
  const result = await HandleClick.handleClick(state, '')
  expect(result).toBe(state)
})

test('handleClick should return state unchanged when item is not found', async () => {
  const state: StatusBarState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'non-existent-item')
  expect(result).toBe(state)
})

test('handleClick should return the same state object', async () => {
  const state: StatusBarState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'any-item')
  expect(result).toBe(state)
})

test('handleClick should call handleClickNotification when item is Notifications', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        elements: [],
        name: 'Notifications',
        tooltip: 'Notifications',
      },
    ],
    statusBarItemsRight: [],
  }

  await HandleClick.handleClick(state, 'Notifications')

  expect(HandleClickNotification.handleClickNotification).toHaveBeenCalled()
})

test('handleClick should not call handleClickNotification when item is not Notifications', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        elements: [],
        name: 'SomeItem',
        tooltip: 'Some Item',
      },
    ],
    statusBarItemsRight: [],
  }

  await HandleClick.handleClick(state, 'SomeItem')

  expect(HandleClickNotification.handleClickNotification).not.toHaveBeenCalled()
})

test('handleClick should call handleClickProblems when item is Problems', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [
      {
        elements: [],
        name: 'Problems',
        tooltip: 'Problems',
      },
    ],
  }

  await HandleClick.handleClick(state, 'Problems')

  expect(HandleClickProblems.handleClickProblems).toHaveBeenCalled()
})

test('handleClick should not call handleClickProblems when item is not Problems', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        elements: [],
        name: 'OtherItem',
        tooltip: 'Other Item',
      },
    ],
    statusBarItemsRight: [],
  }

  await HandleClick.handleClick(state, 'OtherItem')

  expect(HandleClickProblems.handleClickProblems).not.toHaveBeenCalled()
})

test('handleClick should call handleClickExtensionStatusBarItem for extension items', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        command: 'my.extension.command',
        elements: [],
        name: 'my-extension-item',
        tooltip: 'My Extension Item',
      },
    ],
    statusBarItemsRight: [],
  }

  await HandleClick.handleClick(state, 'my-extension-item')

  expect(HandleClickExtensionStatusBarItem.handleClickExtensionStatusBarItem).toHaveBeenCalledWith('my-extension-item')
})

test('handleClick should call handleClickExtensionStatusBarItem with correct name for right items', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [
      {
        command: 'ext.command',
        elements: [],
        name: 'right-item',
        tooltip: 'Right Item',
      },
    ],
  }

  await HandleClick.handleClick(state, 'right-item')

  expect(HandleClickExtensionStatusBarItem.handleClickExtensionStatusBarItem).toHaveBeenCalledWith('right-item')
})

test('handleClick should find item in statusBarItemsLeft', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        elements: [],
        name: 'left-item',
        tooltip: 'Left Item',
      },
    ],
    statusBarItemsRight: [],
  }

  await HandleClick.handleClick(state, 'left-item')

  expect(HandleClickExtensionStatusBarItem.handleClickExtensionStatusBarItem).toHaveBeenCalledWith('left-item')
})

test('handleClick should find item in statusBarItemsRight', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [
      {
        elements: [],
        name: 'right-item',
        tooltip: 'Right Item',
      },
    ],
  }

  await HandleClick.handleClick(state, 'right-item')

  expect(HandleClickExtensionStatusBarItem.handleClickExtensionStatusBarItem).toHaveBeenCalledWith('right-item')
})

test('handleClick should prioritize left items over right items', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        command: 'left.command',
        elements: [],
        name: 'duplicate-item',
        tooltip: 'Left Item',
      },
    ],
    statusBarItemsRight: [
      {
        command: 'right.command',
        elements: [],
        name: 'duplicate-item',
        tooltip: 'Right Item',
      },
    ],
  }

  await HandleClick.handleClick(state, 'duplicate-item')

  expect(HandleClickExtensionStatusBarItem.handleClickExtensionStatusBarItem).toHaveBeenCalledWith('duplicate-item')
  expect(HandleClickExtensionStatusBarItem.handleClickExtensionStatusBarItem).toHaveBeenCalledTimes(1)
})
