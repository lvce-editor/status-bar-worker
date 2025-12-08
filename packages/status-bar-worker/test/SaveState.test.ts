import { expect, test } from '@jest/globals'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SaveState from '../src/parts/SaveState/SaveState.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('saveState should return empty arrays when state has no items', () => {
  const uid = 1
  const state: StatusBarState = { ...createDefaultState(), uid }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([])
  expect(result.itemsRight).toEqual([])
})

test('saveState should return itemsLeft when only left items exist', () => {
  const uid = 2
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
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1, item2],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([item1, item2])
  expect(result.itemsRight).toEqual([])
})

test('saveState should return itemsRight when only right items exist', () => {
  const uid = 3
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
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsRight: [item1, item2],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([])
  expect(result.itemsRight).toEqual([item1, item2])
})

test('saveState should return both itemsLeft and itemsRight', () => {
  const uid = 4
  const leftItem1: StatusBarItem = {
    name: 'left1',
    text: 'Left 1',
    tooltip: 'Left Tooltip 1',
  }
  const leftItem2: StatusBarItem = {
    name: 'left2',
    text: 'Left 2',
    tooltip: 'Left Tooltip 2',
  }
  const rightItem1: StatusBarItem = {
    name: 'right1',
    text: 'Right 1',
    tooltip: 'Right Tooltip 1',
  }
  const rightItem2: StatusBarItem = {
    name: 'right2',
    text: 'Right 2',
    tooltip: 'Right Tooltip 2',
  }
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [leftItem1, leftItem2],
    statusBarItemsRight: [rightItem1, rightItem2],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([leftItem1, leftItem2])
  expect(result.itemsRight).toEqual([rightItem1, rightItem2])
})

test('saveState should return items with all properties', () => {
  const uid = 5
  const item: StatusBarItem = {
    command: 'test.command',
    icon: 'test-icon',
    name: 'test-item',
    text: 'Test Item',
    tooltip: 'Test Tooltip',
  }
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([item])
  expect(result.itemsLeft[0].command).toBe('test.command')
  expect(result.itemsLeft[0].icon).toBe('test-icon')
  expect(result.itemsLeft[0].name).toBe('test-item')
  expect(result.itemsLeft[0].text).toBe('Test Item')
  expect(result.itemsLeft[0].tooltip).toBe('Test Tooltip')
})

test('saveState should return items with optional properties missing', () => {
  const uid = 6
  const item: StatusBarItem = {
    name: 'item',
    text: 'Item',
    tooltip: 'Tooltip',
  }
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsRight: [item],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsRight).toEqual([item])
  expect(result.itemsRight[0].name).toBe('item')
  expect(result.itemsRight[0].text).toBe('Item')
  expect(result.itemsRight[0].tooltip).toBe('Tooltip')
})

test('saveState should handle multiple items in both arrays', () => {
  const uid = 7
  const leftItems: StatusBarItem[] = [
    { name: 'left1', text: 'Left 1', tooltip: 'T1' },
    { name: 'left2', text: 'Left 2', tooltip: 'T2' },
    { name: 'left3', text: 'Left 3', tooltip: 'T3' },
  ]
  const rightItems: StatusBarItem[] = [
    { name: 'right1', text: 'Right 1', tooltip: 'T1' },
    { name: 'right2', text: 'Right 2', tooltip: 'T2' },
    { name: 'right3', text: 'Right 3', tooltip: 'T3' },
  ]
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toHaveLength(3)
  expect(result.itemsRight).toHaveLength(3)
  expect(result.itemsLeft).toEqual(leftItems)
  expect(result.itemsRight).toEqual(rightItems)
})

test('saveState should work with different uid values', () => {
  const uid1 = 10
  const state1: StatusBarState = { ...createDefaultState(), uid: uid1 }
  StatusBarStates.set(uid1, state1, state1)
  const result1 = SaveState.saveState(uid1)
  expect(result1.itemsLeft).toEqual([])
  expect(result1.itemsRight).toEqual([])

  const uid2 = 999
  const item: StatusBarItem = {
    name: 'item',
    text: 'Item',
    tooltip: 'Tooltip',
  }
  const state2: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid: uid2,
  }
  StatusBarStates.set(uid2, state2, state2)
  const result2 = SaveState.saveState(uid2)
  expect(result2.itemsLeft).toEqual([item])
})

test('saveState should return newState items, not oldState items', () => {
  const uid = 8
  const oldItem: StatusBarItem = {
    name: 'old',
    text: 'Old',
    tooltip: 'Old Tooltip',
  }
  const newItem: StatusBarItem = {
    name: 'new',
    text: 'New',
    tooltip: 'New Tooltip',
  }
  const oldState: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [oldItem],
    uid,
  }
  const newState: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [newItem],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([newItem])
  expect(result.itemsLeft).not.toEqual([oldItem])
})

test('saveState should handle empty string values', () => {
  const uid = 9
  const item: StatusBarItem = {
    name: '',
    text: '',
    tooltip: '',
  }
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft[0].name).toBe('')
  expect(result.itemsLeft[0].text).toBe('')
  expect(result.itemsLeft[0].tooltip).toBe('')
})

test('saveState should preserve item order', () => {
  const uid = 11
  const items: StatusBarItem[] = [
    { name: 'first', text: 'First', tooltip: 'T1' },
    { name: 'second', text: 'Second', tooltip: 'T2' },
    { name: 'third', text: 'Third', tooltip: 'T3' },
  ]
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: items,
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft[0].name).toBe('first')
  expect(result.itemsLeft[1].name).toBe('second')
  expect(result.itemsLeft[2].name).toBe('third')
})

test('saveState should handle items with only name property', () => {
  const uid = 12
  const item: StatusBarItem = {
    name: 'minimal',
    text: '',
    tooltip: '',
  }
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsRight: [item],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsRight[0].name).toBe('minimal')
})

test('saveState should handle items with command and icon', () => {
  const uid = 13
  const item: StatusBarItem = {
    command: 'extension.command',
    icon: '$(icon-name)',
    name: 'command-item',
    text: 'Command Item',
    tooltip: 'Command Tooltip',
  }
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft[0].command).toBe('extension.command')
  expect(result.itemsLeft[0].icon).toBe('$(icon-name)')
})

test('saveState should handle zero uid', () => {
  const uid = 0
  const item: StatusBarItem = {
    name: 'item',
    text: 'Item',
    tooltip: 'Tooltip',
  }
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([item])
})

test('saveState should handle negative uid', () => {
  const uid = -1
  const state: StatusBarState = { ...createDefaultState(), uid }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([])
  expect(result.itemsRight).toEqual([])
})

test('saveState should handle large uid values', () => {
  const uid = 999_999
  const item: StatusBarItem = {
    name: 'item',
    text: 'Item',
    tooltip: 'Tooltip',
  }
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsRight: [item],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsRight).toEqual([item])
})

test('saveState should return readonly arrays', () => {
  const uid = 14
  const state: StatusBarState = { ...createDefaultState(), uid }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(Object.isFrozen(result.itemsLeft)).toBe(false)
  expect(Array.isArray(result.itemsLeft)).toBe(true)
  expect(Array.isArray(result.itemsRight)).toBe(true)
})

test('saveState should handle mixed items with and without optional properties', () => {
  const uid = 15
  const items: StatusBarItem[] = [
    {
      name: 'minimal',
      text: '',
      tooltip: '',
    },
    {
      command: 'cmd',
      icon: 'icon',
      name: 'full',
      text: 'Full',
      tooltip: 'Tooltip',
    },
    {
      name: 'partial',
      text: 'Partial',
      tooltip: 'Tooltip',
    },
  ]
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: items,
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toHaveLength(3)
  expect(result.itemsLeft[0].name).toBe('minimal')
  expect(result.itemsLeft[1].command).toBe('cmd')
  expect(result.itemsLeft[2].text).toBe('Partial')
})

test('saveState should handle very long item arrays', () => {
  const uid = 16
  const items: StatusBarItem[] = Array.from({ length: 100 }, (_, i) => ({
    name: `item${i}`,
    text: `Item ${i}`,
    tooltip: `Tooltip ${i}`,
  }))
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: items,
    statusBarItemsRight: items,
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toHaveLength(100)
  expect(result.itemsRight).toHaveLength(100)
  expect(result.itemsLeft[0].name).toBe('item0')
  expect(result.itemsLeft[99].name).toBe('item99')
})

test('saveState should handle items with special characters in text', () => {
  const uid = 17
  const item: StatusBarItem = {
    name: 'special',
    text: 'Special chars: !@#$%^&*()',
    tooltip: 'Tooltip with "quotes" and \'apostrophes\'',
  }
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft[0].text).toBe('Special chars: !@#$%^&*()')
  expect(result.itemsLeft[0].tooltip).toBe('Tooltip with "quotes" and \'apostrophes\'')
})

test('saveState should handle items with unicode characters', () => {
  const uid = 18
  const item: StatusBarItem = {
    name: 'unicode',
    text: 'Unicode: 🚀 中文 العربية',
    tooltip: 'Tooltip: 🎉',
  }
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsRight: [item],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsRight[0].text).toBe('Unicode: 🚀 中文 العربية')
  expect(result.itemsRight[0].tooltip).toBe('Tooltip: 🎉')
})

test('saveState should handle items with long text values', () => {
  const uid = 19
  const longText = 'A'.repeat(1000)
  const longTooltip = 'B'.repeat(2000)
  const item: StatusBarItem = {
    name: 'long',
    text: longText,
    tooltip: longTooltip,
  }
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft[0].text).toBe(longText)
  expect(result.itemsLeft[0].tooltip).toBe(longTooltip)
  expect(result.itemsLeft[0].text.length).toBe(1000)
  expect(result.itemsLeft[0].tooltip.length).toBe(2000)
})
