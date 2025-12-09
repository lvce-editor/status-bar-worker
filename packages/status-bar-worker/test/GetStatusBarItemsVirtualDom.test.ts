import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as GetStatusBarItemsVirtualDom from '../src/parts/GetStatusBarItemsVirtualDom/GetStatusBarItemsVirtualDom.ts'

test('getStatusBarItemsVirtualDom should return container div with empty array', () => {
  const result = GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom([], 'test-class')
  expect(result).toEqual([])
})

test('getStatusBarItemsVirtualDom should return container div with single item', () => {
  const items = [
    {
      name: 'test.item',
      text: 'Test Item',
      tooltip: 'Test Tooltip',
    },
  ]
  const result = GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(items, 'test-class')
  expect(result.length).toBe(3)
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'test-class',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.StatusBarItem,
    name: 'test.item',
    role: 'button',
    tabIndex: -1,
    title: 'Test Tooltip',
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual({
    childCount: 0,
    text: 'Test Item',
    type: VirtualDomElements.Text,
  })
})

test('getStatusBarItemsVirtualDom should return container div with multiple items', () => {
  const items = [
    {
      name: 'item1',
      text: 'Item 1',
      tooltip: 'Tooltip 1',
    },
    {
      name: 'item2',
      text: 'Item 2',
      tooltip: 'Tooltip 2',
    },
  ]
  const result = GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(items, 'test-class')
  expect(result.length).toBe(5)
  expect(result[0]).toEqual({
    childCount: 2,
    className: 'test-class',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.StatusBarItem,
    name: 'item1',
    role: 'button',
    tabIndex: -1,
    title: 'Tooltip 1',
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual({
    childCount: 0,
    text: 'Item 1',
    type: VirtualDomElements.Text,
  })
  expect(result[3]).toEqual({
    childCount: 1,
    className: ClassNames.StatusBarItem,
    name: 'item2',
    role: 'button',
    tabIndex: -1,
    title: 'Tooltip 2',
    type: VirtualDomElements.Div,
  })
  expect(result[4]).toEqual({
    childCount: 0,
    text: 'Item 2',
    type: VirtualDomElements.Text,
  })
})

test('getStatusBarItemsVirtualDom should use provided className', () => {
  const items = [
    {
      name: 'test.item',
      text: 'Test Item',
      tooltip: 'Test Tooltip',
    },
  ]
  const result = GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(items, 'custom-class-name')
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'custom-class-name',
    type: VirtualDomElements.Div,
  })
})

test('getStatusBarItemsVirtualDom should handle items with all fields', () => {
  const items = [
    {
      command: 'test.command',
      icon: 'test-icon',
      name: 'test.item',
      text: 'Test Item',
      tooltip: 'Test Tooltip',
    },
  ]
  const result = GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(items, 'test-class')
  expect(result.length).toBe(3)
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'test-class',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.StatusBarItem,
    name: 'test.item',
    role: 'button',
    tabIndex: -1,
    title: 'Test Tooltip',
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual({
    childCount: 0,
    text: 'Test Item',
    type: VirtualDomElements.Text,
  })
})
