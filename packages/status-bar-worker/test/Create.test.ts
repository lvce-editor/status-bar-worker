import { expect, test } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('create should return a StatusBarState with the given uid', () => {
  const uid = 123
  const result: StatusBarState = { ...createDefaultState(), uid }
  expect(result.uid).toBe(uid)
  expect(result.statusBarItemsLeft).toEqual([])
  expect(result.statusBarItemsRight).toEqual([])
})

test('create should return a StatusBarState with empty arrays', () => {
  const uid = 456
  const result: StatusBarState = { ...createDefaultState(), uid }
  expect(result.statusBarItemsLeft).toEqual([])
  expect(result.statusBarItemsRight).toEqual([])
  expect(Array.isArray(result.statusBarItemsLeft)).toBe(true)
  expect(Array.isArray(result.statusBarItemsRight)).toBe(true)
})

test('create should handle different uid values', () => {
  const uid1 = 0
  const result1: StatusBarState = { ...createDefaultState(), uid: uid1 }
  expect(result1.uid).toBe(0)

  const uid2 = 999
  const result2: StatusBarState = { ...createDefaultState(), uid: uid2 }
  expect(result2.uid).toBe(999)

  const uid3 = -1
  const result3: StatusBarState = { ...createDefaultState(), uid: uid3 }
  expect(result3.uid).toBe(-1)
})

test('create should return a new object each time', () => {
  const uid = 789
  const result1: StatusBarState = { ...createDefaultState(), uid }
  const result2: StatusBarState = { ...createDefaultState(), uid }
  expect(result1).not.toBe(result2)
  expect(result1).toEqual(result2)
})
