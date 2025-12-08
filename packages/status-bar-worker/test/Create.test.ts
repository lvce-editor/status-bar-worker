import { expect, test } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import * as Create from '../src/parts/Create/Create.ts'

test('create should return a StatusBarState with the given uid', () => {
  const uid = 123
  const result: StatusBarState = Create.create(uid)
  expect(result.uid).toBe(uid)
  expect(result.statusBarItemsLeft).toEqual([])
  expect(result.statusBarItemsRight).toEqual([])
})

test('create should return a StatusBarState with empty arrays', () => {
  const uid = 456
  const result: StatusBarState = Create.create(uid)
  expect(result.statusBarItemsLeft).toEqual([])
  expect(result.statusBarItemsRight).toEqual([])
  expect(Array.isArray(result.statusBarItemsLeft)).toBe(true)
  expect(Array.isArray(result.statusBarItemsRight)).toBe(true)
})

test('create should handle different uid values', () => {
  const uid1 = 0
  const result1: StatusBarState = Create.create(uid1)
  expect(result1.uid).toBe(0)

  const uid2 = 999
  const result2: StatusBarState = Create.create(uid2)
  expect(result2.uid).toBe(999)

  const uid3 = -1
  const result3: StatusBarState = Create.create(uid3)
  expect(result3.uid).toBe(-1)
})

test('create should return a new object each time', () => {
  const uid = 789
  const result1: StatusBarState = Create.create(uid)
  const result2: StatusBarState = Create.create(uid)
  expect(result1).not.toBe(result2)
  expect(result1).toEqual(result2)
})
