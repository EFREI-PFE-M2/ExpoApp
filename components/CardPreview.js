import React from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import StarGroup from './StarGroup'

export default function CardPreview(props) {

  let {cardPicture, cardName, cardRarity} = props
  
  return (
    <View style={styles.container}>
      <Image source={{ uri: cardPicture }} style={styles.pic} />
      <Text style={styles.title}>{cardName}</Text>
      <View style={{ transform: [{ scale: 0.5 }], marginTop: -10, width: '100%' }}>
        <StarGroup star={cardRarity} />
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 95,
    height: 90,
    overflow: 'hidden',
    margin: 5
  },
  pic: {
    width: 78,
    height: 51,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 9
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})