import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.ts'

export const activateByEvent = (event: string, assetDir: string, platform: number): Promise<void> => {
  return ExtensionManagementWorker.invoke('Extensions.activateByEvent', event, assetDir, platform)
}

export const getStatusBarItems = (): Promise<readonly any[]> => {
  return ExtensionManagementWorker.invoke('Extensions.getStatusBarItems')
}
