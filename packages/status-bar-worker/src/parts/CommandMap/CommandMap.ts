import { terminate } from '@lvce-editor/viewlet-registry'
import * as StatusBar from '../Create/Create.ts'
import {
  handleClick,
  itemLeftUpdate,
  itemRightCreate,
  itemRightUpdate,
  loadContent,
} from '../LoadContent/LoadContent.ts'

export const commandMap = {
  'StatusBar.create': StatusBar.create,
  'StatusBar.loadContent': loadContent,
  'StatusBar.terminate': terminate,
  'StatusBar.handleClick': handleClick,
  'StatusBar.itemLeftUpdate': itemLeftUpdate,
  'StatusBar.itemRightCreate': itemRightCreate,
  'StatusBar.itemRightUpdate': itemRightUpdate,
}
