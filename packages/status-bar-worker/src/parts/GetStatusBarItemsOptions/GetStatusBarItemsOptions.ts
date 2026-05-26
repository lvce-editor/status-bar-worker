export interface GetStatusBarItemsOptions {
  readonly assetDir: string
  readonly builtinNotificationsEnabled?: boolean
  readonly builtinProblemsEnabled?: boolean
  readonly errorCount: number
  readonly platform: number
  readonly showItems: boolean
  readonly warningCount: number
}
