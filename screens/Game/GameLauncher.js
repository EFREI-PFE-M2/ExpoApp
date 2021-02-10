import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity  } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'

export default function GameLauncher() {

  const navigation = useNavigation()

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{backgroundColor: '#fff'}}>
          <TextInput
              style={{ height: 40, backgroundColor: '#D6D6D6', borderRadius: 10, margin: 10, paddingHorizontal: 10}}
              onChangeText={()=>{}}
              value={''}
              placeholder='Rechercher un adversaire'
           />
        </View>
        <TouchableOpacity 
          onPress={()=>navigation.navigate('CardGame_Ingame')}
          style={{backgroundColor: '#fff', borderRadius: 30, alignSelf: 'flex-start', 
          paddingHorizontal: 20, paddingVertical: 20,
          position: 'absolute',
          alignSelf: 'center',
          bottom: '10%',
          flexDirection: 'row', alignItems: 'center'
          }}>
            <Text style={{color: '#194A4C', fontSize: 22, marginRight: 5}}>Joueur aléatoire</Text>
            <FontAwesome5 name="dice" color="#194A4C" size={22} />
          </TouchableOpacity>
    </View>
  )
}
