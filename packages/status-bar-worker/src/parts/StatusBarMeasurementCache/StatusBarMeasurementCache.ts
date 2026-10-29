import { CacheWorker } from '@lvce-editor/rpc-registry'

interface CachedWidth {
  promise: Promise<number | undefined>
  width?: number
}

// Keep optional disk I/O bounded even when extensions contribute huge item inventories.
const maxPersistentEntries = 256
const persistentEntries = new Map<string, CachedWidth>()
const cacheName = 'lvce-status-bar-measurements-v1'
const fontSize = 12
const fontFamily = 'system-ui, Ubuntu, Droid Sans, sans-serif'

const getCacheKey = (text: string): string => {
  const parameters = [text, 400, fontSize, fontFamily, 0, false, 0]
  return `https://cache.invalid/status-bar-measurements/v1/${encodeURIComponent(JSON.stringify(parameters))}`
}

const isValidWidth = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

const readWidth = async (text: string): Promise<number | undefined> => {
  try {
    const item = await CacheWorker.getCacheStorageJsonItem(getCacheKey(text), cacheName)
    return item && isValidWidth(item.value) ? item.value : undefined
  } catch {
    return undefined
  }
}

export const getWidth = async (text: string): Promise<number | undefined> => {
  const existing = persistentEntries.get(text)
  if (existing) {
    return existing.promise
  }
  if (persistentEntries.size >= maxPersistentEntries) {
    return undefined
  }
  const promise = readWidth(text)
  persistentEntries.set(text, { promise })
  return promise
}

export const setWidth = async (text: string, width: number): Promise<void> => {
  const entry = persistentEntries.get(text)
  if (!entry || entry.width === width) {
    return
  }
  entry.width = width
  entry.promise = Promise.resolve(width)
  try {
    await CacheWorker.setCacheStorageJsonItem(getCacheKey(text), width, cacheName)
  } catch {
    // Cache writes are best-effort; measurements remain usable without persistence.
  }
}
