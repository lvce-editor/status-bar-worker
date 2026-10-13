import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderIncremental } from '../src/parts/RenderIncremental/RenderIncremental.ts'

test('renderIncremental patches changed status bar item text', () => {
  const oldState = {
    ...createDefaultState(),
    initial: false,
    statusBarItemsLeft: [
      {
        ariaLabel: 'main',
        elements: [{ type: 'text' as const, value: 'main' }],
        name: 'git.showBranchPicker',
        tooltip: '',
      },
    ],
    uid: 1,
    visibleStatusBarItemsLeft: [
      {
        ariaLabel: 'main',
        elements: [{ type: 'text' as const, value: 'main' }],
        name: 'git.showBranchPicker',
        tooltip: '',
      },
    ],
  }
  const newState = {
    ...oldState,
    statusBarItemsLeft: [
      {
        ariaLabel: 'feature',
        elements: [{ type: 'text' as const, value: 'feature' }],
        name: 'git.showBranchPicker',
        tooltip: '',
      },
    ],
    visibleStatusBarItemsLeft: [
      {
        ariaLabel: 'feature',
        elements: [{ type: 'text' as const, value: 'feature' }],
        name: 'git.showBranchPicker',
        tooltip: '',
      },
    ],
  }

  const result = renderIncremental(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetPatches)
  expect(result[1]).toBe(1)
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      value: 'feature',
    }),
  )
})

test('renderIncremental initially creates the DOM', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, initial: false, uid: 4 }
  expect(renderIncremental(oldState, newState)[0]).toBe(ViewletCommand.SetDom2)
})

test('renderIncremental returns no patches for the same visible items', () => {
  const state = { ...createDefaultState(), initial: false }
  expect(renderIncremental(state, state)).toEqual([])
})

test('renderIncremental fully renders a newly appended right group instead of sending a legacy Add', () => {
  const oldState = { ...createDefaultState(), initial: false, uid: 3 }
  const newState = {
    ...oldState,
    visibleStatusBarItemsRight: [{ ariaLabel: 'Column', elements: [{ type: 'text' as const, value: 'Col 1' }], name: 'cursor', tooltip: '' }],
  }
  const result = renderIncremental(oldState, newState)
  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[2][0]).toEqual(expect.objectContaining({ className: 'StatusBar' }))
})

test.each([
  { nextElements: [{ type: 'icon' as const, value: 'other' }], nextName: 'item', oldElements: [{ type: 'icon' as const, value: 'old' }] },
  { nextElements: [{ type: 'icon' as const, value: 'old' }], nextName: 'other-item', oldElements: [{ type: 'icon' as const, value: 'old' }] },
  {
    nextElements: [
      { type: 'icon' as const, value: 'icon' },
      { type: 'text' as const, value: 'text' },
    ],
    nextName: 'item',
    oldElements: [
      { type: 'text' as const, value: 'text' },
      { type: 'icon' as const, value: 'icon' },
    ],
  },
  {
    nextElements: [
      { type: 'icon' as const, value: 'one' },
      { type: 'icon' as const, value: 'two' },
    ],
    nextName: 'item',
    oldElements: [{ type: 'text' as const, value: 'text' }],
  },
])('renderIncremental fully renders structural or item identity changes %#', ({ nextElements, nextName, oldElements }) => {
  const oldState = {
    ...createDefaultState(),
    initial: false,
    visibleStatusBarItemsRight: [{ ariaLabel: '', elements: oldElements, name: 'item', tooltip: '' }],
  }
  const newState = {
    ...oldState,
    visibleStatusBarItemsRight: [{ ariaLabel: '', elements: nextElements, name: nextName, tooltip: '' }],
  }
  expect(renderIncremental(oldState, newState)[0]).toBe(ViewletCommand.SetDom2)
})
