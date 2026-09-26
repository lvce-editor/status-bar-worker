import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'

export const updateArray = (items: readonly StatusBarItem[], newItem: Readonly<StatusBarItem>): StatusBarItem[] => {
  const index = getIndex(items, newItem)
  if (index < 0) {
    return [newItem, ...items]
  }
  // eslint-disable-next-line unicorn/no-confusing-array-splice -- Keep updates immutable with toSpliced.
  return items.toSpliced(index, 1, newItem)
}
