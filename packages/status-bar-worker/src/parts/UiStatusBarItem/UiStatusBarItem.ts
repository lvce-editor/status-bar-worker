export interface UiStatusBarItem {
  readonly ariaLabel: string
  readonly command: string
  readonly extensionId?: string
  readonly icon: string
  readonly name: string
  readonly providerId?: string
  readonly spinning?: boolean
  readonly text: string
  readonly tooltip: string
}
