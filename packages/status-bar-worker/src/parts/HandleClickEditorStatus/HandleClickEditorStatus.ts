import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleClickEditorStatus = async (name: string, status: EditorStatus | undefined): Promise<void> => {
  if (!status) {
    return
  }
  switch (name) {
    case InputName.EditorEndOfLine:
      await RendererWorker.invoke('Viewlet.openWidget', 'QuickPick', 'end-of-line')
      return
    case InputName.EditorIndentation:
      await RendererWorker.invoke('Viewlet.openWidget', 'QuickPick', 'indentation')
      return
    case InputName.EditorLanguage:
      await RendererWorker.invoke('Viewlet.openWidget', 'QuickPick', 'language-mode')
      return
    case InputName.EditorPosition:
      await RendererWorker.invoke('Viewlet.openWidget', 'QuickPick', 'go-to-line', status.line, status.column)
      return
  }
}
