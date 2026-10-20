interface StatusBarItemBase {
  readonly type: string
}

export interface StatusBarItemText extends StatusBarItemBase {
  // TODO maybe use numeric type property
  readonly type: 'text'
  readonly value: string
}

export interface StatusBarItemIcon extends StatusBarItemBase {
  readonly spinning?: boolean
  readonly type: 'icon'
  readonly value: string
}

export interface StatusBarItemProgress extends StatusBarItemBase {
  readonly ariaLabel: string
  readonly max: number
  readonly type: 'progress'
  readonly value?: number
}

export type StatusBarItemElement = StatusBarItemText | StatusBarItemIcon | StatusBarItemProgress
