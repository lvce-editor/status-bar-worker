import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const create = (
  uid: number,
  uri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  platform: number,
  assetDir: string,
  applicationId?: string,
): void => {
  const state: StatusBarState = {
    ...(applicationId !== undefined && { applicationId }),
    assetDir,
    errorCount: 0,
    initial: true,
    platform,
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
    visibleStatusBarItemsLeft: [],
    visibleStatusBarItemsRight: [],
    warningCount: 0,
    width,
  }
  set(uid, state, state)
}
