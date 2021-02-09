import React from 'react'
import { StyleSheet } from 'react-native'
import { View } from '../../components/Themed'
import Settings from '../../screens/Settings'

export default function Setting() {
  return (
    <View style={styles.container}>
      <Settings isDialog />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#194A4C',
    borderRadius: 5,
  },
})
