import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const activateByEvent = (event: string, assetDir: string, platform: number): Promise<void> => {
  return ExtensionManagementWorker.invoke('Extensions.activateByEvent', event, assetDir, platform)
}

export const getStatusBarItems = (): Promise<readonly any[]> => {
  return ExtensionManagementWorker.invoke('Extensions.getStatusBarItems')
}
