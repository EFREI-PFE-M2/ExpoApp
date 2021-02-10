import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

export default function GameDeck() {
  return (
    <View style={{flexDirection: 'column'}}>
      <View style={{flexDirection: 'row-reverse', alignItems: 'center', margin: 5}}>
          <TouchableOpacity onPress={()=>{}}>
              <Text style={{color: '#757575'}}>Actualiser</Text>
          </TouchableOpacity>  
      </View>
      <View style={{flexDirection: 'column', flexWrap: 'wrap'}}>
        <Text>Cards here</Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  infoLine: {
    width: '100%',
    backgroundColor: '#fff0',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
})