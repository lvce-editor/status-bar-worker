import { initializeExtensionHostWorker } from '../CreateExtensionHostRpc/CreateExtensionHostRpc.ts'

export const initialize = async (): Promise<void> => {
  await initializeExtensionHostWorker()
}
