import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarItemElement } from '../StatusBarItemElement/StatusBarItemElement.ts'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

const itemName = 'update-progress'

export const handleUpdateProgress = (state: StatusBarState, progress: number | null | undefined): StatusBarState => {
  const { statusBarItemsLeft } = state
  const updatedStatusBarItems = statusBarItemsLeft.filter((item) => item.name !== itemName)
  if (progress === null) {
    return {
      ...state,
      statusBarItemsLeft: updatedStatusBarItems,
    }
  }
  const value = progress === undefined ? undefined : Math.max(0, Math.min(1, progress))
  const percentage = value === undefined ? undefined : Math.round(value * 100)
  const ariaLabel = percentage === undefined ? 'Update download progress' : `Update download progress ${percentage}%`
  const progressElement = {
    ariaLabel: 'Update download progress',
    max: 1,
    type: 'progress' as const,
  }
  const elements: StatusBarItemElement[] = [{ type: 'text', value: 'Update' }]
  if (value === undefined) {
    elements.push(progressElement)
  } else {
    elements.push({ ...progressElement, value })
  }
  const item: StatusBarItem = {
    ariaLabel,
    elements,
    name: itemName,
    tooltip: ariaLabel,
  }
  return {
    ...state,
    statusBarItemsLeft: [...updatedStatusBarItems, item],
  }
}
