import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  TouchableRipple,
} from 'react-native-paper'
import { View, Text } from '../components/Themed'
import Search from '../components/Web/Search'
import Setting from './Dialog/Setting'
import New from './Dialog/New'

export default function Header() {
  const [newVisible, setNewVisible] = useState(false)
  const [dotsVisible, setDotsVisible] = useState(false)
  const newButton = () => setNewVisible(true)
  const bellButton = () => console.log('bell')
  const dotsButton = () => setDotsVisible(true)

  const newOnDismiss = () => setNewVisible(false)
  const dotsOnDismiss = () => setDotsVisible(false)

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

      <Portal>
        <Dialog
          visible={newVisible}
          onDismiss={newOnDismiss}
          style={{ height: 600, width: 500, alignSelf: 'center' }}>
          <Dialog.Content style={{ width: '100%', height: '100%' }}>
            <New />
          </Dialog.Content>
        </Dialog>
        <Dialog
          visible={dotsVisible}
          onDismiss={dotsOnDismiss}
          style={{ height: 600, width: 500, alignSelf: 'center' }}>
          <Dialog.Content style={{ width: '100%', height: '100%' }}>
            <Setting />
          </Dialog.Content>
        </Dialog>
      </Portal>
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
