import { VError } from '@lvce-editor/verror'
import { invokeExtensionCommand } from '../InvokeExtensionCommand/InvokeExtensionCommand.ts'

export const handleClickExtensionStatusBarItem = async (name: string, applicationId?: string): Promise<void> => {
  try {
    await invokeExtensionCommand(applicationId, 'Extensions.executeCommand', name)
  } catch (error) {
    console.error(new VError(error, `Failed to execute status bar command: ${name}`))
  }
}
