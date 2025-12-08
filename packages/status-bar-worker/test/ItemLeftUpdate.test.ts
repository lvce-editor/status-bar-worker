import { expect, test } from '@jest/globals'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ItemLeftUpdate from '../src/parts/ItemLeftUpdate/ItemLeftUpdate.ts'

test('should update existing item in left status bar', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 1 }
  const item1: StatusBarItem = {
    name: 'item1',
    text: 'Original Text',
    tooltip: 'Original Tooltip',
  }
  const item2: StatusBarItem = {
    name: 'item2',
    text: 'Item 2',
    tooltip: 'Tooltip 2',
  }
  const stateWithItems: StatusBarState = {
    ...state,
    statusBarItemsLeft: [item1, item2],
  }
  const updatedItem: StatusBarItem = {
    icon: 'updated-icon',
    name: 'item1',
    text: 'Updated Text',
    tooltip: 'Updated Tooltip',
  }
  const result = ItemLeftUpdate.itemLeftUpdate(stateWithItems, updatedItem)
  expect(result.statusBarItemsLeft).toHaveLength(2)
  expect(result.statusBarItemsLeft[0]).toEqual(updatedItem)
  expect(result.statusBarItemsLeft[1]).toEqual(item2)
  expect(result.uid).toBe(1)
  expect(result.statusBarItemsRight).toEqual([])
})

test('should insert item at beginning when item does not exist', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 2 }
  const item1: StatusBarItem = {
    name: 'item1',
    text: 'Item 1',
    tooltip: 'Tooltip 1',
  }
  const stateWithItems: StatusBarState = {
    ...state,
    statusBarItemsLeft: [item1],
  }
  const newItem: StatusBarItem = {
    name: 'newItem',
    text: 'New Item',
    tooltip: 'New Tooltip',
  }
  const result = ItemLeftUpdate.itemLeftUpdate(stateWithItems, newItem)
  expect(result.statusBarItemsLeft).toHaveLength(2)
  expect(result.statusBarItemsLeft[0]).toEqual(newItem)
  expect(result.statusBarItemsLeft[1]).toEqual(item1)
})

test('should update item in middle of array', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 3 }
  const item1: StatusBarItem = {
    name: 'item1',
    text: 'Item 1',
    tooltip: 'Tooltip 1',
  }
  const item2: StatusBarItem = {
    name: 'item2',
    text: 'Item 2',
    tooltip: 'Tooltip 2',
  }
  const item3: StatusBarItem = {
    name: 'item3',
    text: 'Item 3',
    tooltip: 'Tooltip 3',
  }
  const stateWithItems: StatusBarState = {
    ...state,
    statusBarItemsLeft: [item1, item2, item3],
  }
  const updatedItem: StatusBarItem = {
    name: 'item2',
    text: 'Updated Item 2',
    tooltip: 'Updated Tooltip 2',
  }
  const result = ItemLeftUpdate.itemLeftUpdate(stateWithItems, updatedItem)
  expect(result.statusBarItemsLeft).toHaveLength(3)
  expect(result.statusBarItemsLeft[0]).toEqual(item1)
  expect(result.statusBarItemsLeft[1]).toEqual(updatedItem)
  expect(result.statusBarItemsLeft[2]).toEqual(item3)
})

test('should preserve right status bar items', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 4 }
  const leftItem: StatusBarItem = {
    name: 'leftItem',
    text: 'Left Item',
    tooltip: 'Left Tooltip',
  }
  const rightItem: StatusBarItem = {
    name: 'rightItem',
    text: 'Right Item',
    tooltip: 'Right Tooltip',
  }
  const stateWithItems: StatusBarState = {
    ...state,
    statusBarItemsLeft: [leftItem],
    statusBarItemsRight: [rightItem],
  }
  const updatedLeftItem: StatusBarItem = {
    name: 'leftItem',
    text: 'Updated Left Item',
    tooltip: 'Updated Left Tooltip',
  }
  const result = ItemLeftUpdate.itemLeftUpdate(stateWithItems, updatedLeftItem)
  expect(result.statusBarItemsRight).toEqual([rightItem])
  expect(result.statusBarItemsRight).toHaveLength(1)
})

test('should preserve uid', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 42 }
  const item: StatusBarItem = {
    name: 'item',
    text: 'Item',
    tooltip: 'Tooltip',
  }
  const stateWithItems: StatusBarState = {
    ...state,
    statusBarItemsLeft: [item],
  }
  const updatedItem: StatusBarItem = {
    name: 'item',
    text: 'Updated Item',
    tooltip: 'Updated Tooltip',
  }
  const result = ItemLeftUpdate.itemLeftUpdate(stateWithItems, updatedItem)
  expect(result.uid).toBe(42)
})

test('should handle empty left items array', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 5 }
  const newItem: StatusBarItem = {
    name: 'newItem',
    text: 'New Item',
    tooltip: 'New Tooltip',
  }
  const result = ItemLeftUpdate.itemLeftUpdate(state, newItem)
  expect(result.statusBarItemsLeft).toHaveLength(1)
  expect(result.statusBarItemsLeft[0]).toEqual(newItem)
})

test('should update item with all optional properties', () => {
  const state: StatusBarState = { ...createDefaultState(), uid: 6 }
  const item: StatusBarItem = {
    name: 'item',
    text: 'Item',
    tooltip: 'Tooltip',
  }
  const stateWithItems: StatusBarState = {
    ...state,
    statusBarItemsLeft: [item],
  }
  const updatedItem: StatusBarItem = {
    command: 'command-name',
    icon: 'icon-name',
    name: 'item',
    text: 'Updated Text',
    tooltip: 'Updated Tooltip',
  }
  const result = ItemLeftUpdate.itemLeftUpdate(stateWithItems, updatedItem)
  expect(result.statusBarItemsLeft[0]).toEqual(updatedItem)
  expect(result.statusBarItemsLeft[0].icon).toBe('icon-name')
  expect(result.statusBarItemsLeft[0].command).toBe('command-name')
})
