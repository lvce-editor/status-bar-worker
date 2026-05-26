import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

const getMatchingItemInternal = (items: readonly StatusBarItem[], name: string): StatusBarItem | undefined => {
  for (const item of items) {
    if (item.name === name) {
      return item
    }
  }
  return undefined
}

export const getMatchingItem = (
  itemsLeft: readonly StatusBarItem[],
  itemsRight: readonly StatusBarItem[],
  name: string,
): StatusBarItem | undefined => {
  return getMatchingItemInternal(itemsLeft, name) ?? getMatchingItemInternal(itemsRight, name)
}
