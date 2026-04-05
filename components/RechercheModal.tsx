import { FlatList, StyleSheet, View } from 'react-native';
import { List, MD3Theme, Modal, Portal, Searchbar, useTheme } from 'react-native-paper';
import { useState } from 'react';
import { departements, type Departement } from '../data/departements';

interface RechercheModalProps {
  visible: boolean
  onDismiss: () => void
  onSelect: (departement: Departement) => void
}

export default function RechercheModal({ visible, onDismiss, onSelect }: RechercheModalProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const [query, setQuery] = useState('')

  const results = query.length === 0
    ? departements
    : departements.filter(d =>
        d.nom.toLowerCase().includes(query.toLowerCase()) ||
        d.numero.toLowerCase().includes(query.toLowerCase())
      )

  const handleSelect = (departement: Departement) => {
    setQuery('')
    onSelect(departement)
    onDismiss()
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <Searchbar
          placeholder="Numéro ou nom..."
          value={query}
          onChangeText={setQuery}
          autoFocus
          style={styles.searchbar}
        />
        <FlatList
          data={results}
          keyExtractor={d => d.numero}
          renderItem={({ item }) => (
            <List.Item
              title={item.nom}
              description={item.numero}
              onPress={() => handleSelect(item)}
            />
          )}
          keyboardShouldPersistTaps="handled"
        />
      </Modal>
    </Portal>
  )
}

function makeStyles(theme: MD3Theme) {
  return StyleSheet.create({
    modal: {
      backgroundColor: theme.colors.surface,
      margin: 24,
      borderRadius: 12,
      maxHeight: '80%',
      overflow: 'hidden',
    },
    searchbar: {
      margin: 12,
    },
  })
}
