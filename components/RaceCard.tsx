import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { IconButton, TouchableRipple } from 'react-native-paper'
import { Text, View } from './Themed'
import { useDispatch, useSelector } from 'react-redux'

import {  setSpecificRace } from '../store/raceSlice'

export default function RaceCard(props) {
  const { race } = props

  const navigation = useNavigation()
  const dispatch = useDispatch()
  
  const {
    allocation,
    category,
    distance,
    location,
    raceCode,
    nbContenders,
    raceTitle,
    horses,
    locationCode,
    hour,
  } = race

  

  const onPress = () => {
    dispatch(setSpecificRace(race))
    navigation.navigate('Home_Race', { raceID: race.id })
  }

  const description = `${category} • ${distance}m • ${
    horses?.length || 0
  } partants`

  const hourFormat = hour.split(':')

  return (
    <TouchableRipple style={styles.container} onPress={onPress}>
      <>
        <Text style={styles.time}>{`${hourFormat[0]}h${hourFormat[1]}`}</Text>

        <View style={styles.codeContainer}>
          <Text style={styles.raceCode}>{raceCode}</Text>
          <Text style={styles.raceCode}>{locationCode}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{raceTitle}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={{ flexDirection: 'row' }}>
            <MaterialIcons name="location-on" size={12} color="#757575" />
            <Text style={[styles.description, { paddingLeft: 5 }]}>
              {location}
            </Text>
          </View>
        </View>

        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>123</Text>
          <MaterialIcons name="message" size={12} color="#757575" />
        </View> */}

        <IconButton
          icon="chevron-right"
          size={30}
          color="#757575"
          style={{ position: 'absolute', right: 0, top: 12 }}
        />
      </>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 80,
    width: '100%',
    paddingLeft: 5,
    paddingRight: 40,
    alignItems: 'center',
    borderBottomColor: '#D6D6D6',
    borderBottomWidth: 1,
  },
  time: {
    fontSize: 14,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  raceCode: {
    color: '#194A4C',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#757575',
  },
})
