import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const getExtensionStatusBarItems = async (assetDir: string, platform: number): Promise<readonly any[]> => {
  await ExtensionManagementWorker.invoke('Extensions.activateByEvent', 'onStatusBarItem', assetDir, platform)
  return ExtensionManagementWorker.invoke('Extensions.getStatusBarItems')
}
