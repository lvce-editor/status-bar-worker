import * as Preferences from '../Preferences/Preferences.ts'

export interface StatusBarPreferencesState {
  readonly builtinNotificationsEnabled: boolean
  readonly builtinProblemsEnabled: boolean
  readonly itemsVisible: boolean
}

const getBooleanPreference = async (key: string): Promise<boolean> => {
  const value = await Preferences.get(key)
  return value ?? true
}

export const itemsVisible = async (): Promise<boolean> => {
  return getBooleanPreference('statusBar.itemsVisible')
}

export const builtinNotificationsEnabled = async (): Promise<boolean> => {
  return getBooleanPreference('statusBar.builtinNotificationsEnabled')
}

export const builtinProblemsEnabled = async (): Promise<boolean> => {
  return getBooleanPreference('statusBar.builtinProblemsEnabled')
}

export const loadStatusBarPreferences = async (): Promise<StatusBarPreferencesState> => {
  const [itemsVisible, builtinNotificationsEnabled, builtinProblemsEnabled] = await Promise.all([
    getBooleanPreference('statusBar.itemsVisible'),
    getBooleanPreference('statusBar.builtinNotificationsEnabled'),
    getBooleanPreference('statusBar.builtinProblemsEnabled'),
  ])
  return {
    builtinNotificationsEnabled,
    builtinProblemsEnabled,
    itemsVisible,
  }
}
