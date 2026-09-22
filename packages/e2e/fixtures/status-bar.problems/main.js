import { activate as activateExtensionApi, registerDiagnosticProvider } from '@lvce-editor/api'

const diagnosticProvider = {
  id: 'status-bar-diagnostics',
  languageId: 'xyz',
  provideDiagnostics(textDocument) {
    return [
      {
        uri: textDocument.uri,
        rowIndex: 0,
        columnIndex: 0,
        endRowIndex: 0,
        endColumnIndex: 0,
        message: 'warning 1',
        source: 'status-bar',
        type: 'warning',
      },
      {
        uri: textDocument.uri,
        rowIndex: 1,
        columnIndex: 0,
        endRowIndex: 1,
        endColumnIndex: 0,
        message: 'warning 2',
        source: 'status-bar',
        type: 'warning',
      },
    ]
  },
}

await activateExtensionApi()
registerDiagnosticProvider(diagnosticProvider)
