import { invokeExtensionCommand } from '../InvokeExtensionCommand/InvokeExtensionCommand.ts'

export const getStatusBarItemContextMenuItems = async (extensionId: string, providerId: string, applicationId?: string): Promise<readonly any[]> => {
  try {
    return await invokeExtensionCommand(applicationId, 'Extensions.getStatusBarItemContextMenuItems', extensionId, providerId)
  } catch {
    return []
  }
}
