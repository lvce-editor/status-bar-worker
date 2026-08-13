import { diff2 } from '../Diff2/Diff2.ts'
import { render2 } from '../Render2/Render2.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as StatusBarStates from '../StatusBarStates/StatusBarStates.ts'

export const renderOutOfBand = async (uid: number): Promise<void> => {
  if (!RendererProcess.isConnected()) {
    return
  }
  const { newState } = StatusBarStates.get(uid)
  if (newState.initial) {
    return
  }
  const diffResult = diff2(uid)
  if (diffResult.length === 0) {
    return
  }
  const commands = await render2(uid, diffResult)
  if (commands.length === 0) {
    return
  }
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
}
