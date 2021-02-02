import React from 'react'
import { StyleSheet } from 'react-native'
import { Divider } from 'react-native-paper'
import { View } from '../components/Themed'
import Menu from '../components/Web/Menu'
import ProfileCard from '../components/Web/ProfilCard'

export default function LeftPanel({ current }) {
  return (
    <View style={styles.container}>
      <ProfileCard />
      <Menu current={current} />
      <Divider />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: 250,
    overflow: 'hidden',
  },
})
