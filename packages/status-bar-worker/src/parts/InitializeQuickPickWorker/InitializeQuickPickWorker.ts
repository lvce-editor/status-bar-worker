import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as QuickPickWorker from '../QuickPickWorker/QuickPickWorker.ts'

export const initializeQuickPickWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    async send(port) {
      await RendererWorker.invokeAndTransfer(
        'SendMessagePortToExtensionHostWorker.sendMessagePortToQuickPickWorker',
        port,
        'QuickPick.handleStatusBarMessagePort',
        0,
      )
    },
  })
  QuickPickWorker.set(rpc)
}
