import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'

export interface GetStatusBarItemsOptions {
  readonly applicationId?: string
  readonly assetDir: string
  readonly builtinNotificationsEnabled?: boolean
  readonly builtinProblemsEnabled?: boolean
  readonly editorStatus?: EditorStatus
  readonly errorCount: number
  readonly platform: number
  readonly showItems: boolean
  readonly warningCount: number
}
