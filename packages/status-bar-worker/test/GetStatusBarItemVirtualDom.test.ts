import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as GetStatusBarItemVirtualDom from '../src/parts/GetStatusBarItemVirtualDom/GetStatusBarItemVirtualDom.ts'

test('getStatusBarItemVirtualDom should return div and text node with all properties', () => {
  const statusBarItem = {
    command: 'test.command',
    icon: 'test-icon',
    name: 'test.item',
    text: 'Test Item',
    tooltip: 'Test Tooltip',
  }
  const result = GetStatusBarItemVirtualDom.getStatusBarItemVirtualDom(statusBarItem)
  expect(result.length).toBe(2)
  expect(result[0]).toEqual({
    childCount: 1,
    className: ClassNames.StatusBarItem,
    name: 'test.item',
    role: 'button',
    tabIndex: -1,
    title: 'Test Tooltip',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 0,
    text: 'Test Item',
    type: VirtualDomElements.Text,
  })
})

test('getStatusBarItemVirtualDom should return div and text node with minimal properties', () => {
  const statusBarItem = {
    name: 'test.item',
    text: 'Test Item',
    tooltip: 'Test Tooltip',
  }
  const result = GetStatusBarItemVirtualDom.getStatusBarItemVirtualDom(statusBarItem)
  expect(result.length).toBe(2)
  expect(result[0]).toEqual({
    childCount: 1,
    className: ClassNames.StatusBarItem,
    name: 'test.item',
    role: 'button',
    tabIndex: -1,
    title: 'Test Tooltip',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 0,
    text: 'Test Item',
    type: VirtualDomElements.Text,
  })
})

test('getStatusBarItemVirtualDom should handle empty strings', () => {
  const statusBarItem = {
    name: '',
    text: '',
    tooltip: '',
  }
  const result = GetStatusBarItemVirtualDom.getStatusBarItemVirtualDom(statusBarItem)
  expect(result.length).toBe(2)
  expect(result[0]).toEqual({
    childCount: 1,
    className: ClassNames.StatusBarItem,
    name: '',
    role: 'button',
    tabIndex: -1,
    title: '',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 0,
    text: '',
    type: VirtualDomElements.Text,
  })
})

test('getStatusBarItemVirtualDom should use tooltip as title', () => {
  const statusBarItem = {
    name: 'test.item',
    text: 'Test Item',
    tooltip: 'Custom Tooltip Text',
  }
  const result = GetStatusBarItemVirtualDom.getStatusBarItemVirtualDom(statusBarItem)
  expect(result[0].title).toBe('Custom Tooltip Text')
})

test('getStatusBarItemVirtualDom should use text for text node value', () => {
  const statusBarItem = {
    name: 'test.item',
    text: 'Custom Text Value',
    tooltip: 'Test Tooltip',
  }
  const result = GetStatusBarItemVirtualDom.getStatusBarItemVirtualDom(statusBarItem)
  expect(result[1].text).toBe('Custom Text Value')
})

test('getStatusBarItemVirtualDom should have correct structure properties', () => {
  const statusBarItem = {
    name: 'test.item',
    text: 'Test Item',
    tooltip: 'Test Tooltip',
  }
  const result = GetStatusBarItemVirtualDom.getStatusBarItemVirtualDom(statusBarItem)
  expect(result[0].childCount).toBe(1)
  expect(result[0].className).toBe(ClassNames.StatusBarItem)
  expect(result[0].role).toBe('button')
  expect(result[0].tabIndex).toBe(-1)
  expect(result[0].type).toBe(VirtualDomElements.Div)
  expect(result[1].type).toBe(VirtualDomElements.Text)
})
