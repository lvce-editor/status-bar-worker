import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetStatusBarItemsVirtualDom from '../GetStatusBarItemsVirtualDom/GetStatusBarItemsVirtualDom.ts'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

export const getStatusBarVirtualDom = (statusBarItemsLeft: readonly StatusBarItem[], statusBarItemsRight: readonly StatusBarItem[]): unknown[] => {
  const dom: unknown[] = []
  if (statusBarItemsLeft.length > 0) {
    dom.push(...GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(statusBarItemsLeft, ClassNames.StatusBarItemsLeft))
  }
  if (statusBarItemsRight.length > 0) {
    dom.push(GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(statusBarItemsRight, ClassNames.StatusBarItemsRight))
  }
  return dom
}
