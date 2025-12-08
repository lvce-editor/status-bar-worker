import * as Assert from '../Assert/Assert.ts'
import * as Id from '../Id/Id.ts'
import * as Logger from '../Logger/Logger.ts'

type ListenerFunction = (...args: any[]) => any

export const state: Record<number, ListenerFunction> = Object.create(null)

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const register = (listener: ListenerFunction): number => {
  const id = Id.create()
  state[id] = listener
  return id
}

export const execute = (id: Readonly<number>, ...args: ReadonlyArray<any>): any => {
  Assert.number(id)
  const listener = state[id]
  if (!listener) {
    Logger.warn(`listener with id ${id} not found`)
    return
  }
  return listener(...args)
}

export const unregister = (id: number): void => {
  delete state[id]
}
