import { terminate } from '@lvce-editor/viewlet-registry'
import * as StatusBar from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as ItemLeftUpdate from '../ItemLeftUpdate/ItemLeftUpdate.ts'
import * as ItemRightCreate from '../ItemRightCreate/ItemRightCreate.ts'
import * as ItemRightUpdate from '../ItemRightUpdate/ItemRightUpdate.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { wrapCommand } from '../StatusBarStates/StatusBarStates.ts'

export const commandMap = {
  'StatusBar.create': StatusBar.create,
  'StatusBar.diff2': diff2,
  'StatusBar.handleClick': wrapCommand(HandleClick.handleClick),
  'StatusBar.itemLeftUpdate': wrapCommand(ItemLeftUpdate.itemLeftUpdate),
  'StatusBar.itemRightCreate': wrapCommand(ItemRightCreate.itemRightCreate),
  'StatusBar.itemRightUpdate': wrapCommand(ItemRightUpdate.itemRightUpdate),
  'StatusBar.loadContent': wrapCommand(LoadContent.loadContent),
  'StatusBar.terminate': terminate,
}
