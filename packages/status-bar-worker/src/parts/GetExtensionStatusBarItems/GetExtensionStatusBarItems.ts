import { invokeExtensionCommand } from '../InvokeExtensionCommand/InvokeExtensionCommand.ts'

export const getExtensionStatusBarItems = async (assetDir: string, platform: number, applicationId?: string): Promise<readonly any[]> => {
  await invokeExtensionCommand(applicationId, 'Extensions.activateByEvent', 'onStatusBarItem', assetDir, platform)
  return invokeExtensionCommand(applicationId, 'Extensions.getStatusBarItems')
}
