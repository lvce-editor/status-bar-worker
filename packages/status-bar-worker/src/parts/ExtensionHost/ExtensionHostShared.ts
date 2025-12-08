import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'

type ExecuteProvidersOptions = {
  readonly combineResults: (results: readonly any[]) => any
  readonly event: string
  readonly method: string
  readonly noProviderFoundMessage?: string
  readonly noProviderFoundResult: any
  readonly params: readonly any[]
}

export const executeProviders = async ({
  combineResults,
  event,
  method,
  noProviderFoundMessage = 'No provider found',
  noProviderFoundResult,
  params,
}: ExecuteProvidersOptions): Promise<any> => {
  await ExtensionHostManagement.activateByEvent(event)
  const result = await ExtensionHostWorker.invoke(method, ...params)
  return result
}

type ExecuteProviderOptions = {
  readonly event: string
  readonly method: string
  readonly noProviderFoundMessage: string
  readonly params: readonly any[]
}

export const executeProvider = async ({ event, method, noProviderFoundMessage, params }: ExecuteProviderOptions): Promise<any> => {
  await ExtensionHostManagement.activateByEvent(event)
  const result = ExtensionHostWorker.invoke(method, ...params)
  return result
}

type ExecuteOptions = {
  readonly method: string
  readonly params: readonly any[]
}

export const execute = async ({ method, params }: ExecuteOptions): Promise<any> => {
  await ExtensionHostWorker.invoke(method, ...params)
}
