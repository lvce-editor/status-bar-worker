import { expect, test } from '@jest/globals'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('diff2 should return empty array when states are equal', () => {
  const uid = 1
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([])
})

test('diff2 should return RenderItems when left items differ', () => {
  const uid = 1
  const item1: StatusBarItem = {
    name: 'test',
    text: 'Test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    name: 'test2',
    text: 'Test 2',
    tooltip: 'Test tooltip 2',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff2 should return RenderItems when right items differ', () => {
  const uid = 1
  const item1: StatusBarItem = {
    name: 'test',
    text: 'Test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    name: 'test2',
    text: 'Test 2',
    tooltip: 'Test tooltip 2',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item1],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item2],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff2 should return RenderItems when both left and right items differ', () => {
  const uid = 1
  const item1: StatusBarItem = {
    name: 'test',
    text: 'Test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    name: 'test2',
    text: 'Test 2',
    tooltip: 'Test tooltip 2',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [item1],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [item2],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff2 should return RenderItems when left array length differs', () => {
  const uid = 1
  const item1: StatusBarItem = {
    name: 'test',
    text: 'Test',
    tooltip: 'Test tooltip',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff2 should return RenderItems when right array length differs', () => {
  const uid = 1
  const item1: StatusBarItem = {
    name: 'test',
    text: 'Test',
    tooltip: 'Test tooltip',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [item1],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff2 should ignore uid when comparing', () => {
  const uid = 1
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, state, state)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([])
})

test('diff2 should return RenderItems when multiple items are added', () => {
  const uid = 1
  const item1: StatusBarItem = {
    name: 'test1',
    text: 'Test 1',
    tooltip: 'Test tooltip 1',
  }
  const item2: StatusBarItem = {
    name: 'test2',
    text: 'Test 2',
    tooltip: 'Test tooltip 2',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1, item2],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff2 should return RenderItems when items are removed', () => {
  const uid = 1
  const item1: StatusBarItem = {
    name: 'test1',
    text: 'Test 1',
    tooltip: 'Test tooltip 1',
  }
  const item2: StatusBarItem = {
    name: 'test2',
    text: 'Test 2',
    tooltip: 'Test tooltip 2',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1, item2],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff2 should return RenderItems when item text changes', () => {
  const uid = 1
  const item1: StatusBarItem = {
    name: 'test',
    text: 'Test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    name: 'test',
    text: 'Test Updated',
    tooltip: 'Test tooltip',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff2 should return RenderItems when item tooltip changes', () => {
  const uid = 1
  const item1: StatusBarItem = {
    name: 'test',
    text: 'Test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    name: 'test',
    text: 'Test',
    tooltip: 'Updated tooltip',
  }
  const oldState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
    uid,
  }
  const newState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
    statusBarItemsRight: [],
    uid,
  }
  StatusBarStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff2 should work with different uids independently', () => {
  const uid1 = 1
  const uid2 = 2
  const item1: StatusBarItem = {
    name: 'test1',
    text: 'Test 1',
    tooltip: 'Test tooltip 1',
  }
  const item2: StatusBarItem = {
    name: 'test2',
    text: 'Test 2',
    tooltip: 'Test tooltip 2',
  }
  const oldState1 = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid: uid1,
  }
  const newState1 = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1],
    statusBarItemsRight: [],
    uid: uid1,
  }
  const oldState2 = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid: uid2,
  }
  const newState2 = {
    ...createDefaultState(),
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid: uid2,
  }
  StatusBarStates.set(uid1, oldState1, newState1)
  StatusBarStates.set(uid2, oldState2, newState2)
  const result1 = Diff2.diff2(uid1)
  const result2 = Diff2.diff2(uid2)
  expect(result1).toEqual([DiffType.RenderItems])
  expect(result2).toEqual([])
})
