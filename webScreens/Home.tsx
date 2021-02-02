import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from '../components/Themed'
import LeftPanel from './LeftPanel'

export default function Home({ navigation, route }) {
  return (
    <View style={styles.container}>
      <LeftPanel current={route.name} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
})
