import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker, TextMeasurementWorker } from '@lvce-editor/rpc-registry'

const send = (port: MessagePort): Promise<void> => {
  // @ts-ignore
  return RendererWorker.sendMessagePortToTextMeasurementWorker(port)
}

export const initializeTextMeasurementWorkerRpc = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send,
  })
  TextMeasurementWorker.set(rpc)
}
