import { fileURLToPath } from 'node:url'

const workerPath = fileURLToPath(new URL('../../../.tmp/dist', import.meta.url))
const testWorkerPath = fileURLToPath(new URL('../', import.meta.resolve('@lvce-editor/test-worker')))
process.argv.push(`--link=${workerPath}`, `--link=${testWorkerPath}`)
await import('@lvce-editor/server/bin/server.js')
