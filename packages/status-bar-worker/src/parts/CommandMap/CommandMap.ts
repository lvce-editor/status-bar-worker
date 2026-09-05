import { terminate } from '@lvce-editor/viewlet-registry'
import * as StatusBar from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import { getComponentDom } from '../GetComponentDom/GetComponentDom.ts'
import { getComponentState } from '../GetComponentState/GetComponentState.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleContextMenu from '../HandleContextMenu/HandleContextMenu.ts'
import { handleEditorStatusChangedAll } from '../HandleEditorStatusChangedAll/HandleEditorStatusChangedAll.ts'
import { handleExtensionManagementMessagePort } from '../HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'
import { handleExtensionsChanged } from '../HandleExtensionsChanged/HandleExtensionsChanged.ts'
import { handleItemsChanged } from '../HandleItemsChanged/HandleItemsChanged.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import { handleNotificationCountChanged } from '../HandleNotificationCountChanged/HandleNotificationCountChanged.ts'
import { handleProblemsSummaryChange } from '../HandleProblemsSummaryChange/HandleProblemsSummaryChange.ts'
import { handleWorkspaceChange } from '../HandleWorkspaceChange/HandleWorkspaceChange.ts'
import { initialize } from '../Initialize/Initialize.ts'
import * as ItemLeftUpdate from '../ItemLeftUpdate/ItemLeftUpdate.ts'
import * as ItemRightCreate from '../ItemRightCreate/ItemRightCreate.ts'
import * as ItemRightUpdate from '../ItemRightUpdate/ItemRightUpdate.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { resize } from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'
import { setComponentState } from '../SetComponentState/SetComponentState.ts'
import { getCommandIds, wrapCommand, wrapGetter, wrapSerialCommand } from '../StatusBarStates/StatusBarStates.ts'
import { supportsEditorStatusDeltas } from '../SupportsEditorStatusDeltas/SupportsEditorStatusDeltas.ts'

const handleDirectMessagePort = (port: MessagePort, setAsRendererProcess = true): Promise<void> =>
  HandleMessagePort.handleMessagePort(port, commandMap, setAsRendererProcess)

const activateOnWorkspaceChange = wrapCommand(handleWorkspaceChange)
const refreshExtensionItems = wrapSerialCommand(handleItemsChanged)

const handleWorkspaceChangeAndRefresh = async (uid: number, workspacePath: string): Promise<void> => {
  await activateOnWorkspaceChange(uid, workspacePath)
  await refreshExtensionItems(uid)
}

export const commandMap = {
  'StatusBar.create': StatusBar.create,
  'StatusBar.diff2': diff2,
  'StatusBar.getCommandIds': getCommandIds,
  'StatusBar.getComponentDom': getComponentDom,
  'StatusBar.getComponentState': getComponentState,
  'StatusBar.handleChange': wrapSerialCommand(handleItemsChanged),
  'StatusBar.handleClick': wrapCommand(HandleClick.handleClick),
  'StatusBar.handleContextMenu': wrapCommand(HandleContextMenu.handleContextMenu),
  'StatusBar.handleEditorStatusChanged': handleEditorStatusChangedAll,
  'StatusBar.handleExtensionManagementMessagePort': handleExtensionManagementMessagePort,
  'StatusBar.handleExtensionsChanged': wrapCommand(handleExtensionsChanged),
  'StatusBar.handleItemsChanged': wrapSerialCommand(handleItemsChanged),
  'StatusBar.handleMessagePort': handleDirectMessagePort,
  'StatusBar.handleNotificationCountChanged': wrapCommand(handleNotificationCountChanged),
  'StatusBar.handleProblemsSummaryChange': wrapCommand(handleProblemsSummaryChange),
  'StatusBar.handleWorkspaceChange': handleWorkspaceChangeAndRefresh,
  'StatusBar.initialize': initialize,
  'StatusBar.itemLeftUpdate': wrapCommand(ItemLeftUpdate.itemLeftUpdate),
  'StatusBar.itemRightCreate': wrapCommand(ItemRightCreate.itemRightCreate),
  'StatusBar.itemRightUpdate': wrapCommand(ItemRightUpdate.itemRightUpdate),
  'StatusBar.loadContent': wrapCommand(LoadContent.loadContent),
  'StatusBar.render2': render2,
  'StatusBar.renderEventListeners': renderEventListeners,
  'StatusBar.resize': wrapCommand(resize),
  'StatusBar.saveState': wrapGetter(saveState),
  'StatusBar.setComponentState': setComponentState,
  'StatusBar.supportsEditorStatusDeltas': supportsEditorStatusDeltas,
  'StatusBar.terminate': terminate,
}
