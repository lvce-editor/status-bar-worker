import { expect, test } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import * as Create from '../src/parts/Create/Create.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('create should store state with the given uid', () => {
  const uid = 123
  Create.create(uid)
  const result = StatusBarStates.get(uid)
  const { newState } = result
  const newStateTyped: StatusBarState = newState
  const { oldState } = result
  const oldStateTyped: StatusBarState = oldState
  expect(newStateTyped).toBeDefined()
  expect(newStateTyped.uid).toBe(uid)
  expect(newStateTyped.statusBarItemsLeft).toEqual([])
  expect(newStateTyped.statusBarItemsRight).toEqual([])
  expect(oldStateTyped).toBeDefined()
  expect(oldStateTyped.uid).toBe(uid)
})

test('create should store state with empty arrays', () => {
  const uid = 456
  Create.create(uid)
  const result = StatusBarStates.get(uid)
  const { newState } = result
  const newStateTyped: StatusBarState = newState
  expect(newStateTyped).toBeDefined()
  expect(newStateTyped.statusBarItemsLeft).toEqual([])
  expect(newStateTyped.statusBarItemsRight).toEqual([])
  expect(Array.isArray(newStateTyped.statusBarItemsLeft)).toBe(true)
  expect(Array.isArray(newStateTyped.statusBarItemsRight)).toBe(true)
})

test('create should handle different uid values', () => {
  const uid1 = 0
  Create.create(uid1)
  const result1 = StatusBarStates.get(uid1)
  const state1: StatusBarState = result1.newState
  expect(state1.uid).toBe(0)

  const uid2 = 999
  Create.create(uid2)
  const result2 = StatusBarStates.get(uid2)
  const state2: StatusBarState = result2.newState
  expect(state2.uid).toBe(999)

  const uid3 = -1
  Create.create(uid3)
  const result3 = StatusBarStates.get(uid3)
  const state3: StatusBarState = result3.newState
  expect(state3.uid).toBe(-1)
})

test('create should overwrite existing state for same uid', () => {
  const uid = 789
  Create.create(uid)
  const result1 = StatusBarStates.get(uid)
  const state1 = result1.newState
  expect(state1).toBeDefined()

  Create.create(uid)
  const result2 = StatusBarStates.get(uid)
  const state2 = result2.newState
  expect(state2).toBeDefined()
  expect(state2.uid).toBe(uid)
  expect(state2.statusBarItemsLeft).toEqual([])
  expect(state2.statusBarItemsRight).toEqual([])
})

test('create should store separate states for different uids', () => {
  const uid1 = 100
  const uid2 = 200
  Create.create(uid1)
  Create.create(uid2)
  const result1 = StatusBarStates.get(uid1)
  const state1 = result1.newState
  const result2 = StatusBarStates.get(uid2)
  const state2 = result2.newState
  expect(state1.uid).toBe(100)
  expect(state2.uid).toBe(200)
  expect(state1).not.toBe(state2)
})
