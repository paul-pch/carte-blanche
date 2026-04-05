import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from './theme'
import Accueil from './components/Accueil';

export default function App() {
  const scheme = useColorScheme()
  const [isDark, setIsDark] = useState(scheme === 'dark')

  return (
    <PaperProvider theme={isDark ? darkTheme : lightTheme}>
      <Accueil onToggleTheme={() => setIsDark(prev => !prev)} />
    </PaperProvider>
  )
}
