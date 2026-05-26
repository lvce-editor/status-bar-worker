import * as CommandMap from '../CommandMap/CommandMap.ts'
import { initializeRenderWorker } from '../InitializeRenderWorker/InitializeRenderWorker.ts'
import { registerCommands } from '../StatusBarStates/StatusBarStates.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  await initializeRenderWorker()
}
