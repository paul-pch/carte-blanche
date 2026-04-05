import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper'

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#EBEBEB',  // gris clair — fond de l'écran
    surface: '#FFFFFF',     // blanc — fond des cartes
    primary: '#1D6AE5',     // bleu — boutons
    onPrimary: '#FFFFFF',   // blanc — texte sur boutons
  }
}

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#0D1420',  // navy très profond
    surface: '#152032',     // navy légèrement plus clair — fond des cartes
    primary: '#4B91F7',     // bleu vif — boutons
    onPrimary: '#FFFFFF',   // blanc — texte sur boutons
  }
}
