import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderIncremental } from '../src/parts/RenderIncremental/RenderIncremental.ts'

test('renderIncremental fully renders changed status bar item text', () => {
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
  }

  const result = renderIncremental(oldState, newState)

  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[1]).toBe(1)
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      text: 'feature',
    }),
  )
})
