import { execa } from 'execa'
import { fileURLToPath } from 'node:url'
import { root } from './root.js'

const main = async () => {
  const serverPath = fileURLToPath(import.meta.resolve('@lvce-editor/server/bin/server.js'))
  execa(`npm`, ['run', 'build:watch'], {
    cwd: root,
    stdio: 'inherit',
  })
  execa('node', [serverPath, '--test-path=packages/e2e'], {
    cwd: root,
    stdio: 'inherit',
  })
}

main()
