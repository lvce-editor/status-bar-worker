// import { cp, readFile, readdir, writeFile } from 'node:fs/promises'
// import { dirname, join } from 'node:path'
// import { fileURLToPath, pathToFileURL } from 'node:url'

// const __dirname = dirname(fileURLToPath(import.meta.url))

// const root = join(__dirname, '..', '..', '..')

// export const getRemoteUrl = (path) => {
//   const url = pathToFileURL(path).toString().slice(8)
//   return `/remote/${url}`
// }

// const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')

// const serverStaticPath = join(nodeModulesPath, '@lvce-editor', 'static-server', 'static')

// const RE_COMMIT_HASH = /^[a-z\d]+$/
// const isCommitHash = (dirent) => {
//   return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
// }

// const dirents = await readdir(serverStaticPath)
// const commitHash = dirents.find(isCommitHash) || ''
// const rendererWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')

// const content = await readFile(rendererWorkerMainPath, 'utf-8')

// const explorerWorkerPath = join(root, '.tmp/dist/dist/statusBarWorkerMain.js')

// const remoteUrl = getRemoteUrl(explorerWorkerPath)
// if (!content.includes('// const explorerWorkerUrl = ')) {
//   await cp(rendererWorkerMainPath, rendererWorkerMainPath + '.original')
//   const occurrence = `const explorerWorkerUrl = \`\${assetDir}/packages/explorer-worker/dist/statusBarWorkerMain.js\``
//   const replacement = `// const explorerWorkerUrl = \`\${assetDir}/packages/explorer-worker/dist/statusBarWorkerMain.js\`
//   const explorerWorkerUrl = \`${remoteUrl}\``

//   const newContent = content.replace(occurrence, replacement)
//   await writeFile(rendererWorkerMainPath, newContent)
// }
