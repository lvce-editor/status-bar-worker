import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import * as StatusBarMeasurementCache from '../StatusBarMeasurementCache/StatusBarMeasurementCache.ts'

const fontSize = 12
const fontFamily = 'system-ui, Ubuntu, Droid Sans, sans-serif'
const itemPaddingAndMargin = 16
const iconWidth = 20
const progressWidth = 69
const horizontalGroupPadding = 14

const measuredWidths = new WeakMap<StatusBarItem, Promise<number>>()
const fallbackTextWidth = 150

const measureTextWidths = async (values: readonly string[]): Promise<readonly number[]> => {
  if (values.length === 0) {
    return []
  }
  const cachedWidths = await Promise.all(values.map((value) => StatusBarMeasurementCache.getWidth(value)))
  const missingValues = values.filter((_, index) => cachedWidths[index] === undefined)
  if (missingValues.length === 0) {
    return cachedWidths as number[]
  }
  let measuredWidths: readonly number[]
  let measurementSucceeded = true
  try {
    measuredWidths = await TextMeasurementWorker.measureTextWidths(missingValues, 400, fontSize, fontFamily, 0, false, 0)
  } catch {
    measurementSucceeded = false
    measuredWidths = missingValues.map(() => fallbackTextWidth)
  }
  let measuredIndex = 0
  const widths = cachedWidths.map((width) => {
    if (width !== undefined) {
      return width
    }
    const measuredWidth = measuredWidths[measuredIndex++]
    if (measurementSucceeded) {
      void StatusBarMeasurementCache.setWidth(missingValues[measuredIndex - 1], measuredWidth)
    }
    return measuredWidth
  })
  return widths
}

const getElementWidth = (element: StatusBarItem['elements'][number], textWidths: readonly number[], textIndex: number): number => {
  switch (element.type) {
    case 'icon':
      return iconWidth
    case 'progress':
      return progressWidth
    case 'text':
      return textWidths[textIndex]
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
      itemWidth += getElementWidth(element, textWidths, textIndex)
      if (element.type === 'text') {
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
