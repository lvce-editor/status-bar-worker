import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const getStatusBarItemContextMenuItems = async (extensionId: string, providerId: string): Promise<readonly any[]> => {
  try {
    return await ExtensionManagementWorker.invoke('Extensions.getStatusBarItemContextMenuItems', extensionId, providerId)
  } catch {
    return []
  }
}
