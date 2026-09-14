let visible = true

export const isVisible = (): boolean => visible

export const setVisible = (value: boolean): void => {
  visible = value
}

export const reset = (): void => {
  visible = true
}
