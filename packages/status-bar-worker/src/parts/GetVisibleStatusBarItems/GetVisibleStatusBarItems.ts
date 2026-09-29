import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarItemElement } from '../StatusBarItemElement/StatusBarItemElement.ts'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

const fontSize = 12
const fontFamily = 'system-ui, Ubuntu, Droid Sans, sans-serif'
const itemPaddingAndMargin = 16
const iconWidth = 20
const horizontalGroupPadding = 14

const measuredWidths = new WeakMap<StatusBarItem, Promise<number>>()
const fallbackTextWidth = 150

const measureText = async (value: string): Promise<number> => {
  try {
    return await TextMeasurementWorker.invoke('TextMeasurement.measureTextWidth', value, 400, fontSize, fontFamily, 0, false, 0)
  } catch {
    return fallbackTextWidth
  }
}

const measureElement = async (element: StatusBarItemElement): Promise<number> => {
  if (element.type === 'icon') {
    return iconWidth
  }
  return measureText(element.value)
}

const measureItem = (item: StatusBarItem): Promise<number> => {
  const existing = measuredWidths.get(item)
  if (existing) {
    return existing
  }
  const measurement = (async (): Promise<number> => {
    const widths = await Promise.all(item.elements.map(measureElement))
    return itemPaddingAndMargin + widths.reduce((sum, width) => sum + width, 0)
  })()
  measuredWidths.set(item, measurement)
  return measurement
}

const getItemWidths = async (items: readonly StatusBarItem[]): Promise<readonly number[]> => {
  return Promise.all(items.map(measureItem))
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
  const [leftWidths, rightWidths] = await Promise.all([getItemWidths(statusBarItemsLeft), getItemWidths(statusBarItemsRight)])
  const right = fitItems(statusBarItemsRight, rightWidths, innerWidth)
  const left = fitItems(statusBarItemsLeft, leftWidths, innerWidth - right.usedWidth)
  return {
    ...state,
    visibleStatusBarItemsLeft: equalItems(visibleStatusBarItemsLeft, left.items) ? visibleStatusBarItemsLeft : left.items,
    visibleStatusBarItemsRight: equalItems(visibleStatusBarItemsRight, right.items) ? visibleStatusBarItemsRight : right.items,
  }
}
