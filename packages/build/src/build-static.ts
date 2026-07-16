import { cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.js'

const sharedProcess = await import('@lvce-editor/shared-process')

process.env.PATH_PREFIX = '/status-bar-worker'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

const rendererWorkerPath = join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')

export const getRemoteUrl = (path: string): string => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const content = await readFile(rendererWorkerPath, 'utf8')
const workerPath = join(root, '.tmp/dist/dist/statusBarWorkerMain.js')
const remoteUrl = getRemoteUrl(workerPath)

const occurrence = `// const statusBarWorkerUrl = \`\${assetDir}/packages/status-bar-worker/dist/statusBarWorkerMain.js\`
const statusBarWorkerUrl = \`${remoteUrl}\``
const replacement = `const statusBarWorkerUrl = \`\${assetDir}/packages/status-bar-worker/dist/statusBarWorkerMain.js\``
if (!content.includes(occurrence)) {
  throw new Error('occurrence not found')
}
const newContent = content.replace(occurrence, replacement)
await writeFile(rendererWorkerPath, newContent)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
