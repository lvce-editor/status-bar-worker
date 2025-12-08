import * as Preferences from '../Preferences/Preferences.ts'

export const itemsVisible = (): boolean => {
  const statusBarItemsPreference = Preferences.get('statusBar.itemsVisible') ?? false
  return statusBarItemsPreference
}
