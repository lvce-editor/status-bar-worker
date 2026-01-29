import { type Rpc } from '@lvce-editor/rpc'
import { ExtensionHost } from '@lvce-editor/rpc-registry'
import { createExtensionHostRpc } from '../CreateExtensionHostRpc/CreateExtensionHostRpc.ts'

export const initialize = async (): Promise<Rpc> => {
  const rpc = await createExtensionHostRpc()
  ExtensionHost.set(rpc)
  return rpc
}
