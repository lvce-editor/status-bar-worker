import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionManagementCommandMap from '../ExtensionManagementCommandMap/ExtensionManagementCommandMap.ts'

export const handleExtensionManagementMessagePort = async (port: MessagePort): Promise<void> => {
  const rpc = await PlainMessagePortRpc.create({
    commandMap: ExtensionManagementCommandMap.commandMap,
    messagePort: port,
  })
  ExtensionManagementWorker.set(rpc)
}
