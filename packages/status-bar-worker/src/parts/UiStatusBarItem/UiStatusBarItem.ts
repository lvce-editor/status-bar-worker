export interface UiStatusBarItem {
  readonly ariaLabel: string
  readonly command: string
  readonly icon: string
  readonly name: string
  readonly spinning?: boolean
  readonly text: string
  readonly tooltip: string
}
