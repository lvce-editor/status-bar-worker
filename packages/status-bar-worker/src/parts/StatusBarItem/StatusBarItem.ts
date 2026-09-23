import type { StatusBarItemElement } from '../StatusBarItemElement/StatusBarItemElement.ts'

export type StatusBarItem = {
  readonly ariaLabel: string
  readonly command?: string
  readonly enabled?: boolean
  readonly elements: readonly StatusBarItemElement[]
  readonly name: string
  readonly extensionId?: string
  readonly providerId?: string
  readonly tooltip: string
  readonly isError?: boolean
}
