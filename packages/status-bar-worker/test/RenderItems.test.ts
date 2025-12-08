import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'

test('renderItems should return SetDom2 command with uid and empty dom when no items', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = { ...createDefaultState(), uid: 1 }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result).toEqual([ViewletCommand.SetDom2, 1, []])
})

test('renderItems should return SetDom2 command with items in left side', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        command: 'command1',
        icon: 'icon1',
        name: 'item1',
        text: 'Item 1',
        tooltip: 'Tooltip 1',
      },
    ],
    uid: 2,
  }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(2)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})

test('renderItems should return SetDom2 command with items in right side', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsRight: [
      {
        command: 'command2',
        icon: 'icon2',
        name: 'item2',
        text: 'Item 2',
        tooltip: 'Tooltip 2',
      },
    ],
    uid: 3,
  }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(3)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})

test('renderItems should return SetDom2 command with items in both sides', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        command: 'command1',
        icon: 'icon1',
        name: 'item1',
        text: 'Item 1',
        tooltip: 'Tooltip 1',
      },
    ],
    statusBarItemsRight: [
      {
        command: 'command2',
        icon: 'icon2',
        name: 'item2',
        text: 'Item 2',
        tooltip: 'Tooltip 2',
      },
    ],
    uid: 4,
  }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(4)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})

test('renderItems should use uid from newState', () => {
  const oldState: StatusBarState = { ...createDefaultState(), uid: 10 }
  const newState: StatusBarState = { ...createDefaultState(), uid: 20 }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[1]).toBe(20)
})

test('renderItems should ignore oldState and only use newState', () => {
  const oldState: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        command: 'old-command',
        icon: 'old-icon',
        name: 'old-item',
        text: 'Old Item',
        tooltip: 'Old Tooltip',
      },
    ],
    uid: 100,
  }
  const newState: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        command: 'new-command',
        icon: 'new-icon',
        name: 'new-item',
        text: 'New Item',
        tooltip: 'New Tooltip',
      },
    ],
    uid: 200,
  }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[1]).toBe(200)
  expect(result[2].length).toBeGreaterThan(0)
})

test('renderItems should handle multiple items', () => {
  const oldState: StatusBarState = createDefaultState()
  const newState: StatusBarState = {
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
    uid: 5,
  }

  const result = RenderItems.renderItems(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(5)
  expect(Array.isArray(result[2])).toBe(true)
  expect(result[2].length).toBeGreaterThan(0)
})
