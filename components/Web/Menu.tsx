import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { View } from '../Themed'
import MenuItems from './../../constants/WebPanelConstants'

export default function Menu({ current, changeCurrent }) {
  return (
    <View style={styles.container}>
      {Object.entries(MenuItems).map((el) => {
        const selected = current === el[0]
        const opacity = selected ? 1 : 0.6
        const onPress = () => changeCurrent(el[0])
        return (
          <Button
            color="#194A4C"
            style={[styles.button, { opacity }]}
            contentStyle={{ justifyContent: 'flex-start' }}
            labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
            icon={el[1]}
            onPress={onPress}>
            {el[0]}
          </Button>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
})
