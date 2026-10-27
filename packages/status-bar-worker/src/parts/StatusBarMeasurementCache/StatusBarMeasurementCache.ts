import { CacheWorker } from '@lvce-editor/rpc-registry'

const cacheName = 'lvce-status-bar-measurements-v1'
const fontSize = 12
const fontFamily = 'system-ui, Ubuntu, Droid Sans, sans-serif'

const getCacheKey = (text: string): string => {
  const parameters = [text, 400, fontSize, fontFamily, 0, false, 0]
  return `/status-bar-measurements/v1/${encodeURIComponent(JSON.stringify(parameters))}`
}

const isValidWidth = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

export const getWidth = async (text: string): Promise<number | undefined> => {
  try {
    const item = await CacheWorker.getCacheStorageJsonItem(getCacheKey(text), cacheName)
    return item && isValidWidth(item.value) ? item.value : undefined
  } catch {
    return undefined
  }
}

export const setWidth = async (text: string, width: number): Promise<void> => {
  try {
    await CacheWorker.setCacheStorageJsonItem(getCacheKey(text), width, cacheName)
  } catch {
    // Cache writes are best-effort; measurements remain usable without persistence.
  }
}
