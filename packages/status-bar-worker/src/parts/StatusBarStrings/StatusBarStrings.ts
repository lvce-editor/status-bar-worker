import * as I18nString from '../I18NString/I18NString.ts'
import * as UiStrings from '../UiStrings/UiStrings.ts'

export const editorPosition = (line: number, column: number): string => {
  return I18nString.i18nString(UiStrings.EditorPosition, { PH1: line, PH2: column })
}

export const editorPositionWithSelection = (line: number, column: number, selectedChars: number): string => {
  return I18nString.i18nString(UiStrings.EditorPositionWithSelection, { PH1: line, PH2: column, PH3: selectedChars })
}

export const editorPositionAriaLabel = (line: number, column: number): string => {
  return I18nString.i18nString(UiStrings.EditorPositionAriaLabel, { PH1: line, PH2: column })
}

export const editorPositionWithSelectionAriaLabel = (line: number, column: number, selectedChars: number): string => {
  return I18nString.i18nString(UiStrings.EditorPositionWithSelectionAriaLabel, { PH1: line, PH2: column, PH3: selectedChars })
}

export const editorIndentationSpaces = (tabSize: number): string => {
  return I18nString.i18nString(UiStrings.EditorIndentationSpaces, { PH1: tabSize })
}

export const editorIndentationTabs = (tabSize: number): string => {
  return I18nString.i18nString(UiStrings.EditorIndentationTabs, { PH1: tabSize })
}

export const editorEncoding = (encoding: string): string => {
  return I18nString.i18nString(UiStrings.EditorEncoding, { PH1: encoding })
}

export const editorEndOfLine = (endOfLine: string): string => {
  return I18nString.i18nString(UiStrings.EditorEndOfLine, { PH1: endOfLine })
}

export const editorLanguage = (languageId: string): string => {
  return I18nString.i18nString(UiStrings.EditorLanguage, { PH1: languageId })
}

export const goToLineColumn = (): string => I18nString.i18nString(UiStrings.GoToLineColumn)
export const selectIndentation = (): string => I18nString.i18nString(UiStrings.SelectIndentation)
export const selectEncoding = (): string => I18nString.i18nString(UiStrings.SelectEncoding)
export const selectEndOfLineSequence = (): string => I18nString.i18nString(UiStrings.SelectEndOfLineSequence)
export const selectLanguageMode = (): string => I18nString.i18nString(UiStrings.SelectLanguageMode)

export const problem = (count: number): string => I18nString.i18nString(UiStrings.Problem, { PH1: count })
export const problems = (count: number): string => I18nString.i18nString(UiStrings.Problems, { PH1: count })
export const warning = (count: number): string => I18nString.i18nString(UiStrings.Warning, { PH1: count })
export const warnings = (count: number): string => I18nString.i18nString(UiStrings.Warnings, { PH1: count })
export const problemsAriaLabel = (problemLabel: string, warningLabel: string): string =>
  I18nString.i18nString(UiStrings.ProblemsAriaLabel, { PH1: problemLabel, PH2: warningLabel })
export const noProblems = (): string => I18nString.i18nString(UiStrings.NoProblems)
export const problemsTooltip = (): string => I18nString.i18nString(UiStrings.ProblemsTooltip)
export const notification = (count: number): string => I18nString.i18nString(UiStrings.Notification, { PH1: count })
export const notifications = (count: number): string => I18nString.i18nString(UiStrings.Notifications, { PH1: count })
export const noNotifications = (): string => I18nString.i18nString(UiStrings.NoNotifications)
