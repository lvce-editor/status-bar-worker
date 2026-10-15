import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const invokeExtensionCommand = (applicationId: string | undefined, command: string, ...args: readonly unknown[]): Promise<any> => {
  if (applicationId !== undefined) {
    return ExtensionManagementWorker.invoke('Extensions.invokeForApplication', applicationId, command, ...args)
  }
  return ExtensionManagementWorker.invoke(command, ...args)
}
