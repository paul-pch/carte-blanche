import { useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Button, MD3Theme, Text, useTheme } from 'react-native-paper';

interface DepartementProps {
  numero: string
  nom: string
  reversed?: boolean
}

export default function Departement({ numero, nom, reversed = false }: DepartementProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const [isRevealed, setIsRevealed] = useState(false)
  const flipAnim = useRef(new Animated.Value(0)).current

  const handleFlip = () => {
    const toValue = isRevealed ? 0 : 1
    setIsRevealed(prev => !prev)
    Animated.spring(flipAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 10,
    }).start()
  }

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  })

  return (
    <View style={styles.card}>
      <View style={styles.flipContainer}>
        <Animated.View style={[styles.face, { transform: [{ perspective: 1000 }, { rotateY: frontRotate }] }]}>
          <Text variant="displayLarge" style={styles.text}>{reversed ? nom : numero}</Text>
        </Animated.View>
        <Animated.View style={[styles.face, { transform: [{ perspective: 1000 }, { rotateY: backRotate }] }]}>
          <Text variant="displayLarge" style={styles.text}>{reversed ? numero : nom}</Text>
        </Animated.View>
      </View>
      <View style={styles.actions}>
        <Button mode="contained" onPress={handleFlip}>
          {isRevealed ? 'Cacher' : 'Révéler'}
        </Button>
      </View>
    </View>
  )
}

function makeStyles(theme: MD3Theme) {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      elevation: theme.dark ? 0 : 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: theme.dark ? 0 : 0.15,
      shadowRadius: 16,
      borderWidth: theme.dark ? 1 : 0,
      borderColor: 'rgba(255, 255, 255, 0.07)',
    },
    flipContainer: {
      flex: 1,
    },
    face: {
      position: 'absolute',
      top: 0, right: 0, bottom: 0, left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backfaceVisibility: 'hidden',
    },
    actions: {
      alignItems: 'center',
      paddingBottom: 32,
    },
    text: {
      textAlign: 'center',
      paddingHorizontal: 16,
    }
  })
}
