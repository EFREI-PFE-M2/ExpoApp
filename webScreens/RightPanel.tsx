import React from 'react'
import { StyleSheet } from 'react-native'
import { Surface } from 'react-native-paper'
import { View } from '../components/Themed'
import HomeDirect from '../screens/Home/HomeDirect'

export default function RightPanel() {
  return (
    <Surface style={styles.container}>
      <HomeDirect />
    </Surface>
  )
}

const styles = StyleSheet.create({
  container: {
    elevation: 5,
  },
})
