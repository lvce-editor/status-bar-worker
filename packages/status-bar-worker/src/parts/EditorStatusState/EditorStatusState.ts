import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'

let editorStatus: EditorStatus | undefined

export const get = (): EditorStatus | undefined => editorStatus

export const set = (value: EditorStatus | undefined): void => {
  editorStatus = value
}

export const reset = (): void => {
  editorStatus = undefined
}

export const applyUpdate = (update: Partial<EditorStatus> | undefined): EditorStatus | undefined => {
  if (update === undefined) {
    editorStatus = undefined
    return editorStatus
  }
  // Older editor workers omit these fields; retain their original display defaults.
  const next = { endOfLine: 'lf', insertSpaces: true, ...editorStatus, ...update }
  if (
    typeof next.column !== 'number' ||
    typeof next.encoding !== 'string' ||
    typeof next.endOfLine !== 'string' ||
    typeof next.insertSpaces !== 'boolean' ||
    typeof next.languageId !== 'string' ||
    typeof next.line !== 'number' ||
    typeof next.tabSize !== 'number'
  ) {
    throw new TypeError('The first editor status update must contain a complete status')
  }
  editorStatus = next as EditorStatus
  return editorStatus
}
