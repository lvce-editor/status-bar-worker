import { expect, test } from '@jest/globals'
import type { UiStatusBarItem } from '../src/parts/UiStatusBarItem/UiStatusBarItem.ts'
import * as ToStatusBarItem from '../src/parts/ToStatusBarItem/ToStatusBarItem.ts'
import * as ToUiStatusBarItem from '../src/parts/ToUiStatusBarItem/ToUiStatusBarItem.ts'
import * as ToUiStatusBarItems from '../src/parts/ToUiStatusBarItems/ToUiStatusBarItems.ts'

test('toStatusBarItem should include icon and text elements', () => {
  const uiStatusBarItem: UiStatusBarItem = {
    command: 'test.command',
    icon: 'TestIcon',
    name: 'test',
    text: 'Test',
    tooltip: 'Test tooltip',
  }

  const result = ToStatusBarItem.toStatusBarItem(uiStatusBarItem)

  expect(result).toEqual({
    ariaLabel: 'Test',
    command: 'test.command',
    elements: [
      { type: 'icon', value: 'TestIcon' },
      { type: 'text', value: 'Test' },
    ],
    name: 'test',
    tooltip: 'Test tooltip',
  })
})

test('toStatusBarItem should use fallback text element and aria label', () => {
  const uiStatusBarItem: UiStatusBarItem = {
    command: '',
    icon: '',
    name: 'test',
    text: '',
    tooltip: 'Test tooltip',
  }

  const result = ToStatusBarItem.toStatusBarItem(uiStatusBarItem)

  expect(result).toEqual({
    ariaLabel: 'Test tooltip',
    command: undefined,
    elements: [{ type: 'text', value: '' }],
    name: 'test',
    tooltip: 'Test tooltip',
  })
})

test('toUiStatusBarItem should normalize branch icon', () => {
  const result = ToUiStatusBarItem.toUiStatusBarItem({
    command: 'test.command',
    icon: 'branch',
    id: 'test',
    text: 'Test',
    tooltip: 'Test tooltip',
  })

  expect(result).toEqual({
    command: 'test.command',
    icon: 'Branch',
    name: 'test',
    text: 'Test',
    tooltip: 'Test tooltip',
  })
})

test('toUiStatusBarItems should return empty array for missing items', () => {
  expect(ToUiStatusBarItems.toUiStatusBarItems(null)).toEqual([])
  expect(ToUiStatusBarItems.toUiStatusBarItems(undefined)).toEqual([])
})
