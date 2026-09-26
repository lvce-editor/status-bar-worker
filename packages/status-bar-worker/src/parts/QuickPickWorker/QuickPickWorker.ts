const state: { rpc: any } = {
  rpc: undefined,
}

export const set = (rpc: any): void => {
  state.rpc = rpc
}

export const invoke = (method: string, ...args: readonly unknown[]): Promise<unknown> => {
  const { rpc } = state
  return rpc.invoke(method, ...args)
}

export const registerMockRpc = (
  commandMap: Record<string, (...args: readonly any[]) => any>,
): { invocations: unknown[][]; [Symbol.dispose]: () => void } => {
  const { rpc: oldRpc } = state
  const invocations: unknown[][] = []
  state.rpc = {
    invoke(command: string, ...args: readonly unknown[]): unknown {
      invocations.push([command, ...args])
      return commandMap[command](...args)
    },
  }
  return {
    invocations,
    [Symbol.dispose](): void {
      state.rpc = oldRpc
    },
  }
}
