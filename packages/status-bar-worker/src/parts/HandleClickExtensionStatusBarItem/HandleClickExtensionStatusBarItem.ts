import { ExtensionHost } from '@lvce-editor/rpc-registry'
import { VError } from '@lvce-editor/verror'

export const handleClickExtensionStatusBarItem = async (name: string): Promise<void> => {
  // TODO maybe relay this to extension management worker,
  // and it forwards it to the right extension host?

  try {
    // @ts-ignore
    await ExtensionHost.invoke(`ExtensionHostStatusBar.executeCommand`, name)
  } catch (error) {
    console.error(new VError(error, `Failed to execute status bar command: ${name}`))
  }
}
