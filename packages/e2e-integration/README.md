# Application integration tests

These tests moved from `lvce-editor` and run in this repository's `Integration` workflow. The workflow builds this repository, checks out a pinned LVCE application, and installs the local build into that disposable checkout before running the tests. Existing standalone e2e coverage stays in `packages/e2e`.

The application checkout supplies the renderer, extensions, CSS, Electron launcher, and test runner required by these scenarios. Update its commit in `.github/workflows/integration.yml` when a newer application runtime is needed.

Scenarios that exercise only status-bar worker rendering or editor state belong in `packages/e2e`. The remaining integration scenarios need the application runtime:

- `status-bar.extension-many-items-{10,100,1000,10000,100000}` uses application extension-host command activation, repeated extension status-bar item delivery, resize virtualization, and disable-workspace cleanup. The standalone worker harness cannot execute `ExtensionHost.executeCommand` or exercise that application lifecycle.
- `status-bar.problems-diagnostic-counts` creates a TypeScript type error and verifies the real diagnostics service updates the Problems item when the editor opens and closes; the standalone harness has no integrated TypeScript diagnostics service.
- `status-bar.root-accessibility` checks the application layout's status-bar mount/hide lifecycle and root accessibility attributes. The standalone harness omits those application layout attributes (`aria-roledescription` is absent in the standalone probe).
- `status-bar.update-progress` exercises the application's `StatusBar.handleUpdateProgress` command and progress-item lifecycle. That command is not registered by the standalone harness.

To run locally, build this repository and install the pinned application checkout's dependencies, then run:

```sh
node packages/e2e-integration/prepare.mjs /path/to/disposable/lvce-editor
cd /path/to/disposable/lvce-editor/packages/extension-host-worker-tests
npm run e2e:headless
```

Use a disposable checkout: preparation replaces its test inventory and overlays the local build. See the workflow for initial settings and additional script commands.
