import { expect, test } from '@jest/globals'
import * as GetProblemsAriaLabel from '../src/parts/GetProblemsAriaLabel/GetProblemsAriaLabel.ts'

test('getProblemsAriaLabel should return no problems when there are no diagnostics', () => {
  const result = GetProblemsAriaLabel.getProblemsAriaLabel(0, 0)

  expect(result).toBe('No Problems')
})

test('getProblemsAriaLabel should include singular problem and warning labels', () => {
  const result = GetProblemsAriaLabel.getProblemsAriaLabel(1, 1)

  expect(result).toBe('1 Problem, 1 Warning')
})

test('getProblemsAriaLabel should include plural problem and warning labels', () => {
  const result = GetProblemsAriaLabel.getProblemsAriaLabel(2, 3)

  expect(result).toBe('2 Problems, 3 Warnings')
})

test('getProblemsAriaLabel should omit zero-value sections', () => {
  const result = GetProblemsAriaLabel.getProblemsAriaLabel(0, 2)

  expect(result).toBe('2 Warnings')
})