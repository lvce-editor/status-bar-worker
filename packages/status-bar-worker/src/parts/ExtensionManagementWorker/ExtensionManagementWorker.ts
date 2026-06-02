import { createMockRpc, type Rpc } from '@lvce-editor/rpc'

type DisposableMockRpc = ReturnType<typeof createMockRpc> & {
  [Symbol.dispose]?: () => void
}

let rpc: Rpc | undefined
let resolveReady: (value: Rpc) => void
let ready = new Promise<Rpc>((resolve) => {
  resolveReady = resolve
})

export const set = (value: Rpc): void => {
  rpc = value
  resolveReady(value)
}

const get = async (): Promise<Rpc> => {
  if (rpc) {
    return rpc
  }
  return ready
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const currentRpc = await get()
  return currentRpc.invoke(method, ...params)
}

export const registerMockRpc = (commandMap: any): any => {
  const mockRpc: DisposableMockRpc = createMockRpc({ commandMap })
  set(mockRpc)
  mockRpc[Symbol.dispose] = (): void => {
    rpc = undefined
    ready = new Promise<Rpc>((resolve) => {
      resolveReady = resolve
    })
  }
  return mockRpc
}
