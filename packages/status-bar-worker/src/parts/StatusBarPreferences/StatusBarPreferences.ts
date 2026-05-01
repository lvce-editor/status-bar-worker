import * as Preferences from '../Preferences/Preferences.ts'

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
