import { handleItemsChanged } from '../HandleItemsChanged/HandleItemsChanged.ts'
import { wrapSerialAsyncCommand } from '../StatusBarStates/StatusBarStates.ts'

export const refreshExtensionItems = wrapSerialAsyncCommand(async (context) => {
  const state = context.getState()
  const { statusBarItemsLeft } = state
  const updated = await handleItemsChanged(state)
  if (updated === state) {
    return
  }
  await context.updateState((current) => {
    if (current.statusBarItemsLeft !== statusBarItemsLeft) {
      return current
    }
    return { ...current, statusBarItemsLeft: updated.statusBarItemsLeft }
  })
})
