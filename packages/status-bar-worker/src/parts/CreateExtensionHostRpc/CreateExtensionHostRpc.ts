import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ExtensionHost } from '@lvce-editor/rpc-registry'
import { sendMessagePortToExtensionHostWorker } from '../SendMessagePortToExtensionHostWorker/SendMessagePortToExtensionHostWorker.ts'

export const initializeExtensionHostWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToExtensionHostWorker,
  })
  ExtensionHost.set(rpc)
}
