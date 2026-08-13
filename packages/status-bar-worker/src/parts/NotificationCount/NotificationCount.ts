let latestCount: number | undefined

export const get = (): number | undefined => {
  return latestCount
}

export const reset = (): void => {
  latestCount = undefined
}

export const set = (count: number): void => {
  latestCount = count
}
