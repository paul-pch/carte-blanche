import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { IconButton, List, MD3Theme, Modal, Portal, useTheme } from 'react-native-paper';
import { useRef, useState } from 'react';
import { departements, type Departement } from '../data/departements';

interface RechercheModalProps {
  visible: boolean
  onDismiss: () => void
  onSelect: (departement: Departement) => void
}

export default function RechercheModal({ visible, onDismiss, onSelect }: RechercheModalProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const inputRef = useRef<TextInput>(null)
  const [query, setQuery] = useState('')

  const results = query.length === 0
    ? departements
    : departements.filter(d =>
        d.nom.toLowerCase().includes(query.toLowerCase()) ||
        d.numero.toLowerCase().includes(query.toLowerCase())
      )

  const handleSelect = (departement: Departement) => {
    setQuery('')
    inputRef.current?.clear()
    onSelect(departement)
    onDismiss()
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.clear()
    inputRef.current?.focus()
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <View style={styles.searchRow}>
          <TextInput
            ref={inputRef}
            placeholder="Numéro ou nom..."
            placeholderTextColor={theme.colors.onSurfaceDisabled}
            onChangeText={setQuery}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.input}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <IconButton icon="close" size={20} />
            </TouchableOpacity>
          )}
        </View>
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
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 12,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 8,
      paddingLeft: 12,
    },
    input: {
      flex: 1,
      height: 48,
      color: theme.colors.onSurface,
      fontSize: 16,
    },
  })
}
