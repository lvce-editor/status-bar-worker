import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import * as ExtensionManagementCommandMap from '../ExtensionManagementCommandMap/ExtensionManagementCommandMap.ts'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.ts'

export const handleExtensionManagementMessagePort = async (port: MessagePort): Promise<void> => {
  const rpc = await PlainMessagePortRpc.create({
    commandMap: ExtensionManagementCommandMap.commandMap,
    messagePort: port,
  })
  ExtensionManagementWorker.set(rpc)
}
