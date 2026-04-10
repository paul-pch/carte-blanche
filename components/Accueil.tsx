import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton, MD3Theme, useTheme } from "react-native-paper"
import Departement from './Departement'
import RechercheModal from './RechercheModal'
import { randomDepartement, type Departement as DepartementType } from '../data/departements'

interface AccueilProps {
  onToggleTheme: () => void
}

export default function Accueil({ onToggleTheme }: AccueilProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const [current, setCurrent] = useState<DepartementType>(() => randomDepartement())
  const [searchVisible, setSearchVisible] = useState(false)
  const [reversed, setReversed] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Departement key={`${current.numero}-${reversed}`} numero={current.numero} nom={current.nom} reversed={reversed} />
      </View>
      <View style={styles.controls}>
        <IconButton
          icon="magnify"
          mode="contained"
          size={32}
          onPress={() => setSearchVisible(true)}
        />
        <IconButton
          icon="refresh"
          mode="contained"
          size={32}
          onPress={() => setCurrent(randomDepartement())}
        />
        <IconButton
          icon="swap-horizontal"
          mode="contained"
          size={32}
          onPress={() => setReversed(prev => !prev)}
        />
        <IconButton
          icon="theme-light-dark"
          mode="contained"
          size={32}
          onPress={onToggleTheme}
        />
      </View>
      <RechercheModal
        visible={searchVisible}
        onDismiss={() => setSearchVisible(false)}
        onSelect={setCurrent}
      />
    </SafeAreaView>
  )
}

function makeStyles(theme: MD3Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
      alignItems: 'center',
    },
    card: {
      flex: 1,
      alignSelf: 'stretch',
    },
    controls: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
  })
}
