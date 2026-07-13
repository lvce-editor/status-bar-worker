import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { renderItems } from '../RenderItems/RenderItems.ts'

export const renderIncremental = (oldState: StatusBarState, newState: StatusBarState): any => {
  return renderItems(oldState, newState)
}
