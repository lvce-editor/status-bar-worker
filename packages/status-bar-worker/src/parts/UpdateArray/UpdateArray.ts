import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'

export const updateArray = (items: readonly StatusBarItem[], newItem: Readonly<StatusBarItem>): StatusBarItem[] => {
  const index = getIndex(items, newItem)
  if (index < 0) {
    return [newItem, ...items]
  }
  return items.toSpliced(index, 1, newItem)
}
