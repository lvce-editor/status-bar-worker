import { expect, test } from '@jest/globals'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import * as UpdateArray from '../src/parts/UpdateArray/UpdateArray.ts'

const createItem = (name: string): StatusBarItem => ({
  ariaLabel: name,
  elements: [{ type: 'text', value: name }],
  name,
  tooltip: name,
})

test.each([0, 1, 2])('should replace item at index %i without changing other items', (index) => {
  const first = createItem('first')
  const middle = createItem('middle')
  const last = createItem('last')
  const items = [first, middle, last]
  const newItem = createItem(items[index].name)
  const result = UpdateArray.updateArray(items, newItem)

  expect(result).toHaveLength(items.length)
  for (const [itemIndex, item] of result.entries()) {
    expect(item).toBe(itemIndex === index ? newItem : items[itemIndex])
  }
  expect(items[index]).not.toBe(newItem)
})

test('should insert a missing item at the beginning without duplicating existing items', () => {
  const first = createItem('first')
  const second = createItem('second')
  const items = [first, second]
  const newItem = createItem('new')
  const result = UpdateArray.updateArray(items, newItem)

  expect(result).toEqual([newItem, first, second])
  expect(result[1]).toBe(first)
  expect(result[2]).toBe(second)
  expect(items).toEqual([first, second])
})

test('should insert into an empty array', () => {
  const newItem = createItem('new')

  expect(UpdateArray.updateArray([], newItem)).toEqual([newItem])
})
