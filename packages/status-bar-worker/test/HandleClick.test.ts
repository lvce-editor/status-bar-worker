import { expect, test } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClick from '../src/parts/HandleClick/HandleClick.ts'

test('handleClick should return state unchanged', async () => {
  const state: StatusBarState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'test-item')
  expect(result).toEqual(state)
})

test('handleClick should return state with items unchanged', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        command: 'test.command',
        icon: 'test-icon',
        name: 'test-item',
        text: 'Test',
        tooltip: 'Test tooltip',
      },
    ],
    statusBarItemsRight: [],
  }
  const result = await HandleClick.handleClick(state, 'test-item')
  expect(result).toEqual(state)
})

test('handleClick should return state with disposed flag unchanged', async () => {
  const state: StatusBarState & { disposed?: boolean } = {
    ...createDefaultState(),
    disposed: true,
  }
  const result = await HandleClick.handleClick(state, 'test-item')
  expect(result).toEqual(state)
  expect((result as any).disposed).toBe(true)
})

test('handleClick should return state with different name', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        command: 'command1',
        icon: 'icon1',
        name: 'item1',
        text: 'Item 1',
        tooltip: 'Tooltip 1',
      },
      {
        command: 'command2',
        icon: 'icon2',
        name: 'item2',
        text: 'Item 2',
        tooltip: 'Tooltip 2',
      },
    ],
    statusBarItemsRight: [
      {
        command: 'command3',
        icon: 'icon3',
        name: 'item3',
        text: 'Item 3',
        tooltip: 'Tooltip 3',
      },
    ],
  }
  const result = await HandleClick.handleClick(state, 'item2')
  expect(result).toEqual(state)
})

test('handleClick should return state with empty name', async () => {
  const state: StatusBarState = createDefaultState()
  const result = await HandleClick.handleClick(state, '')
  expect(result).toEqual(state)
})
