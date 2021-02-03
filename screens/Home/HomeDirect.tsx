import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import RaceCard from '../../components/RaceCard'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { selectRaces, updateRaces } from '../../store/raceSlice'
import DatePicker from '../../components/DatePicker'

export default function HomeDirect() {
  const races = useSelector(selectRaces);
  const [date, setDate] = useState();
  const dispatch = useDispatch()


  useEffect(() => {
    setDate(new Date())
  }, [])

  useEffect(() => {
    if(date){
      dispatch(updateRaces(date))
    }
  }, [date])
  
  return (
    <View style={{backgroundColor: '#fff', height: '100%'}}>
      <DatePicker date={date} setDate={setDate}/>
      <ScrollView>
        <View>
          {races?.map((race, key) => (
            <RaceCard race={race} key={key} />
          ))}
        </View>
        <Text style={{paddingBottom: 50, paddingTop: 10, color: '#757575', flex: 1, textAlign: 'center'}}>Pas plus de courses ce jour ci</Text>
    </ScrollView>
  </View>
  )
}


