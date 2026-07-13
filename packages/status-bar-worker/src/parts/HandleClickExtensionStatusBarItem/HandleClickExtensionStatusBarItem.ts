import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { VError } from '@lvce-editor/verror'

export const handleClickExtensionStatusBarItem = async (name: string): Promise<void> => {
  try {
    await ExtensionManagementWorker.invoke('Extensions.executeCommand', name)
  } catch (error) {
    console.error(new VError(error, `Failed to execute status bar command: ${name}`))
  }
}
