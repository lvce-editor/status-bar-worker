import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { CacheWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { initializeMenuWorker } from '../InitializeMenuWorker/InitializeMenuWorker.ts'
import { initializeQuickPickWorker } from '../InitializeQuickPickWorker/InitializeQuickPickWorker.ts'
import { registerCommands } from '../StatusBarStates/StatusBarStates.ts'

const registerCacheWorker = async (): Promise<void> => {
  const lazyRpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    async send(port): Promise<void> {
      try {
        await RendererWorker.sendMessagePortToCacheWorker(port)
      } catch (error) {
        await registerCacheWorker()
        throw error
      }
    },
  })
  CacheWorker.set(lazyRpc)
}

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  await Promise.all([
    RendererWorker.initializeRendererWorkerForWorker(CommandMap.commandMap),
    initializeQuickPickWorker(),
    initializeMenuWorker(),
    RendererWorker.initializeTextMeasurementWorker(),
    registerCacheWorker(),
  ])
}
