import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

export const handleExtensionManagementChange = async (): Promise<void> => {
  for (const uid of StatusBarStates.getKeys()) {
    await RendererWorker.invoke('Viewlet.executeViewletCommand', uid, 'handleItemsChanged')
  }
}
