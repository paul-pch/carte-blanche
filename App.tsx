import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightTheme, darkTheme } from './theme'
import Accueil from './components/Accueil';

export default function App() {
  const scheme = useColorScheme()
  const [isDark, setIsDark] = useState(scheme === 'dark')

  return (
    <SafeAreaProvider>
      <PaperProvider theme={isDark ? darkTheme : lightTheme}>
        <Accueil onToggleTheme={() => setIsDark(prev => !prev)} />
      </PaperProvider>
    </SafeAreaProvider>
  )
}
