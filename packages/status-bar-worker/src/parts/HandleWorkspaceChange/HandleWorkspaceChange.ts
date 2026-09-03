import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const handleWorkspaceChange = async (state: StatusBarState): Promise<StatusBarState> => {
  const { assetDir, platform } = state
  await ExtensionManagementWorker.invoke('Extensions.activateByEvent', 'onStatusBarItem', assetDir, platform)
  return state
}
