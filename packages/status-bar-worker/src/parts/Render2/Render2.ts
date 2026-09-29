import { ViewletCommand } from '@lvce-editor/constants'
import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as Diff from '../Diff/Diff.ts'
import * as GetVisibleStatusBarItems from '../GetVisibleStatusBarItems/GetVisibleStatusBarItems.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as SourceControlStates from '../StatusBarStates/StatusBarStates.ts'

const renderDirect = async (uid: number, commands: readonly any[]): Promise<readonly any[]> => {
  const rendererWorkerCommands = commands.filter((command) => command[0] === ViewletCommand.SetFocusContext)
  const rendererProcessCommands = commands.filter((command) => command[0] !== ViewletCommand.SetFocusContext)
  const transactionId = await RendererProcess.invoke('Viewlet.queueCommands', uid, rendererProcessCommands)
  return [...rendererWorkerCommands, ['Viewlet.commitPending', uid, transactionId]]
}

export const render2 = async (uid: number, _diffResult: readonly number[]): Promise<readonly any[]> => {
  let current = SourceControlStates.get(uid)
  let { newState } = current
  while (true) {
    const measuredState = await GetVisibleStatusBarItems.getVisibleStatusBarItems(newState)
    const latest = SourceControlStates.get(uid)
    const { newState: latestState } = latest
    if (latestState === newState) {
      current = latest
      newState = measuredState
      SourceControlStates.set(uid, current.oldState, newState)
      break
    }
    newState = latestState
  }
  const diffResult = [...new Set([..._diffResult, ...Diff.diff(current.oldState, newState)])]
  const { oldState } = current
  const commands = ApplyRender.applyRender(oldState, newState, diffResult)
  if (!RendererProcess.isConnected()) {
    return commands
  }
  return renderDirect(uid, commands)
}
