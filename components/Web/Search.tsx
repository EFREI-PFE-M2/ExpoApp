import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { TextInput, IconButton } from 'react-native-paper'
import { View } from '../Themed'

export default function Search() {
  const [input, setInput] = useState('')
  return (
    <View style={{ width: '35%', backgroundColor: '#fff0' }}>
      <TextInput
        placeholder="Rechercher un utilisateur, un groupe"
        value={input}
        onChangeText={(value) => setInput(value)}
        theme={{ colors: { text: '#fff' }, roundness: 20 }}
        style={styles.container}
        mode="flat"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 35,
    backgroundColor: '#fff3',
    borderRadius: 20,
  },
})
