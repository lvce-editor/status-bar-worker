import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getProblemsStatusBarItem } from '../src/parts/GetProblemsStatusBarItem/GetProblemsStatusBarItem.ts'
import { handleProblemsSummaryChange } from '../src/parts/HandleProblemsSummaryChange/HandleProblemsSummaryChange.ts'

test('updates the visible Problems item with active editor counts', () => {
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: getProblemsStatusBarItem(0, 0, true),
  }
  const result = handleProblemsSummaryChange(state, {
    errorCount: 3,
    hasEditor: true,
    warningCount: 2,
  })
  expect(result.errorCount).toBe(3)
  expect(result.warningCount).toBe(2)
  expect(result.statusBarItemsLeft).toEqual(getProblemsStatusBarItem(3, 2, true))
})

test('clears counts but keeps the Problems item visible when the active editor closes', () => {
  const state = {
    ...createDefaultState(),
    errorCount: 3,
    statusBarItemsLeft: getProblemsStatusBarItem(3, 2, true),
    warningCount: 2,
  }
  const result = handleProblemsSummaryChange(state, {
    errorCount: 3,
    hasEditor: false,
    warningCount: 2,
  })
  expect(result.statusBarItemsLeft).toEqual(getProblemsStatusBarItem(0, 0, true))
})

test('does not add a Problems item when it is disabled', () => {
  const state = createDefaultState()
  const result = handleProblemsSummaryChange(state, {
    errorCount: 1,
    hasEditor: true,
    warningCount: 0,
  })
  expect(result.errorCount).toBe(1)
  expect(result.statusBarItemsLeft).toEqual([])
})

test('returns the same state when the counts are unchanged', () => {
  const state = createDefaultState()
  const result = handleProblemsSummaryChange(state, {
    errorCount: 0,
    hasEditor: true,
    warningCount: 0,
  })
  expect(result).toBe(state)
})
