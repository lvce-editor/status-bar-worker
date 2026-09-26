import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import * as InputName from '../InputName/InputName.ts'
import * as QuickPickWorker from '../QuickPickWorker/QuickPickWorker.ts'

export const handleClickEditorStatus = async (name: string, status: EditorStatus | undefined): Promise<void> => {
  if (!status) {
    return
  }
  switch (name) {
    case InputName.EditorEndOfLine:
      await QuickPickWorker.invoke('QuickPick.openStatusBarPicker', 'end-of-line')
      return
    case InputName.EditorIndentation:
      await QuickPickWorker.invoke('QuickPick.openStatusBarPicker', 'indentation')
      return
    case InputName.EditorLanguage:
      await QuickPickWorker.invoke('QuickPick.openStatusBarPicker', 'language-mode')
      return
    case InputName.EditorPosition:
      await QuickPickWorker.invoke('QuickPick.openStatusBarPicker', 'go-to-line', status.line, status.column)
      return
  }
}
