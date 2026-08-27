import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'

let editorStatus: EditorStatus | undefined

export const get = (): EditorStatus | undefined => editorStatus

export const set = (value: EditorStatus | undefined): void => {
  editorStatus = value
}

export const reset = (): void => {
  editorStatus = undefined
}
