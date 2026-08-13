import { RendererWorker } from '@lvce-editor/rpc-registry'

export const handleClickNotification = async (): Promise<void> => {
  await RendererWorker.invoke('Viewlet.openWidget', 'NotificationCenter')
}
