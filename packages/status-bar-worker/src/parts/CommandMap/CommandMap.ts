import { terminate } from '@lvce-editor/viewlet-registry'
import * as StatusBar from '../Create/Create.ts'
import { loadContent } from '../LoadContent/LoadContent.ts'

export const commandMap = {
  'StatusBar.create': StatusBar.create,
  'StatusBar.loadContent': loadContent,
  'StatusBar.terminate': terminate,
}
