import { terminate } from '@lvce-editor/viewlet-registry'
import * as StatusBar from '../Create/Create.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as ItemLeftUpdate from '../ItemLeftUpdate/ItemLeftUpdate.ts'
import * as ItemRightCreate from '../ItemRightCreate/ItemRightCreate.ts'
import * as ItemRightUpdate from '../ItemRightUpdate/ItemRightUpdate.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'

export const commandMap = {
  'StatusBar.create': StatusBar.create,
  'StatusBar.handleClick': HandleClick.handleClick,
  'StatusBar.itemLeftUpdate': ItemLeftUpdate.itemLeftUpdate,
  'StatusBar.itemRightCreate': ItemRightCreate.itemRightCreate,
  'StatusBar.itemRightUpdate': ItemRightUpdate.itemRightUpdate,
  'StatusBar.loadContent': LoadContent.loadContent,
  'StatusBar.terminate': terminate,
}
