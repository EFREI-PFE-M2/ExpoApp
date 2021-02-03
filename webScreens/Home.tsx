import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, View } from '../components/Themed'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import Panel from './Panel'
import { Surface } from 'react-native-paper'

export default function Home({ navigation, route }) {
  return (
    <View style={styles.container}>
      <LeftPanel current={route.name} />
      <Surface style={styles.panel}>
        <Panel current={route.name} />
      </Surface>
      <RightPanel />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    maxWidth: 1500,
    alignSelf: 'center',
  },
  panel: {
    // marginHorizontal: 5, 
    flex: 1,
    elevation: 5,
    zIndex: 1
  }
})
