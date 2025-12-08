import { RendererWorker } from '@lvce-editor/rpc-registry'

export const activateByEvent = (event: string): Promise<void> => {
  return RendererWorker.activateByEvent(event)
}
