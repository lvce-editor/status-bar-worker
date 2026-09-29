import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

const fontSize = 12
const fontFamily = 'system-ui, Ubuntu, Droid Sans, sans-serif'
const itemPaddingAndMargin = 16
const iconWidth = 20
const horizontalGroupPadding = 14

const measuredWidths = new WeakMap<StatusBarItem, Promise<number>>()
const fallbackTextWidth = 150

const measureTextWidths = async (values: readonly string[]): Promise<readonly number[]> => {
  if (values.length === 0) {
    return []
  }
  try {
    return await TextMeasurementWorker.measureTextWidths(values, 400, fontSize, fontFamily, 0, false, 0)
  } catch {
    return values.map(() => fallbackTextWidth)
  }
}

const getItemWidths = async (items: readonly StatusBarItem[]): Promise<readonly number[]> => {
  const unmeasuredItems = [...new Set(items.filter((item) => !measuredWidths.has(item)))]
  const textElements = unmeasuredItems.flatMap((item) => item.elements.filter((element) => element.type === 'text'))
  const textWidths = await measureTextWidths(textElements.map((element) => element.value))
  let textIndex = 0
  for (const item of unmeasuredItems) {
    let itemWidth = itemPaddingAndMargin
    for (const element of item.elements) {
      if (element.type === 'icon') {
        itemWidth += iconWidth
      } else {
        itemWidth += textWidths[textIndex]
        textIndex++
      }
    }
    measuredWidths.set(item, Promise.resolve(itemWidth))
  }
  return Promise.all(items.map((item) => measuredWidths.get(item)!))
}

const fitItems = (
  items: readonly StatusBarItem[],
  widths: readonly number[],
  availableWidth: number,
): { items: readonly StatusBarItem[]; usedWidth: number } => {
  const visible: StatusBarItem[] = []
  let usedWidth = 0
  for (let i = 0; i < items.length; i++) {
    const itemWidth = widths[i]
    if (itemWidth <= availableWidth - usedWidth) {
      visible.push(items[i])
      usedWidth += itemWidth
    }
  }
  return { items: visible, usedWidth }
}

const equalItems = (left: readonly StatusBarItem[], right: readonly StatusBarItem[]): boolean => {
  return left.length === right.length && left.every((item, index) => item === right[index])
}

export const getVisibleStatusBarItems = async (state: StatusBarState): Promise<StatusBarState> => {
  const { statusBarItemsLeft, statusBarItemsRight, visibleStatusBarItemsLeft, visibleStatusBarItemsRight, width } = state
  const innerWidth = Math.max(0, width - horizontalGroupPadding)
  const itemWidths = await getItemWidths([...statusBarItemsLeft, ...statusBarItemsRight])
  const leftWidths = itemWidths.slice(0, statusBarItemsLeft.length)
  const rightWidths = itemWidths.slice(statusBarItemsLeft.length)
  const right = fitItems(statusBarItemsRight, rightWidths, innerWidth)
  const left = fitItems(statusBarItemsLeft, leftWidths, innerWidth - right.usedWidth)
  return {
    ...state,
    visibleStatusBarItemsLeft: equalItems(visibleStatusBarItemsLeft, left.items) ? visibleStatusBarItemsLeft : left.items,
    visibleStatusBarItemsRight: equalItems(visibleStatusBarItemsRight, right.items) ? visibleStatusBarItemsRight : right.items,
  }
}
