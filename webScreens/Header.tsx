import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, IconButton, TouchableRipple } from 'react-native-paper'
import { View, Text } from '../components/Themed'
import Search from '../components/Web/Search'

export default function Header() {
  const newButton = () => console.log('new')
  const bellButton = () => console.log('bell')
  const dotsButton = () => console.log('dots')
  return (
    <View style={styles.container}>
      <TouchableRipple onPress={() => console.log('menu')}>
        <Text style={styles.title}>Turf</Text>
      </TouchableRipple>
      <Search />
      <View style={styles.iconGroup}>
        <Button
          mode="text"
          color="#fff"
          style={{ height: 30 }}
          icon="pen"
          onPress={newButton}>
          Nouveau
        </Button>
        <IconButton icon="bell" color="#fff" onPress={bellButton} />
        <IconButton icon="dots-horizontal" color="#fff" onPress={dotsButton} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    backgroundColor: '#194A4C',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 25,
  },
  iconGroup: {
    flexDirection: 'row',
    backgroundColor: '#0000',
    alignItems: 'center',
  },
})
