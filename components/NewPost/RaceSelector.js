import React, { useEffect, useState } from 'react'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import { IconButton } from 'react-native-paper'
import DatePicker from '../../components/DatePicker'
import { useDispatch, useSelector } from 'react-redux'
import { selectRaces, updateRaces } from '../../store/raceSlice'
import { ScrollView } from 'react-native-gesture-handler'
import RaceCardSelector from '../../components/RaceCardSelector'

export default function RaceSelector({ navigation }) {
  
  const races = useSelector(selectRaces);
  const [date, setDate] = useState();
  const [selectedRace, setSelectedRace] = useState();
  const dispatch = useDispatch()


  useEffect(() => {
    setDate(new Date())
  }, [])

  useEffect(() => {
    if(date){
      dispatch(updateRaces(date))
    }
  }, [date])

  const handleSelectRace = (race) => {
    setSelectedRace(race)
  }

  const goToBetEditor = () => {
    
    let newDate = new Date(`${date.toISOString().split('T')[0]}T${selectedRace.hour}`)
    navigation.navigate('Bet_Editor', {race: selectedRace})
  }
  

  return (
    <View style={{ flexDirection: 'column', flex: 1, backgroundColor: '#fff'}}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <IconButton
              icon="chevron-left"
              onPress={() => navigation.goBack()}
              size={30}
              color="#fff"
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              Sélection de la course
            </Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
        <DatePicker date={date} setDate={setDate}/>
            
        <ScrollView>
            <View>
                {races?.map((race, key) => (
                     <RaceCardSelector race={race} key={key} 
                     selectedRace={selectedRace}
                     handleSelectRace={handleSelectRace}/>
                 ))}
            </View>
            <Text style={{paddingBottom: 50, paddingTop: 10, color: '#757575', flex: 1, textAlign: 'center'}}>Pas plus de courses ce jour ci</Text>
        </ScrollView>         
  
        <View style={{flexDirection: 'row', borderWidth: 1, borderColor: '#D6D6D6', borderStyle: 'solid', paddingHorizontal: 20,
    paddingVertical: 20}}>
            <Text style={{color: '#757575', flex: 1}}>
                {
                    selectedRace ?
                    `Course ${selectedRace.raceCode}-${selectedRace.locationCode} selectionnée` :
                    'Aucune course selectionnée'
                }
                
            </Text>
            {
                selectedRace &&
                <TouchableOpacity  onPress={goToBetEditor}>
                    <Text style={{color: '#194A4C', fontWeight: 'bold'}}>Suivant</Text>
                </TouchableOpacity>
            }
            
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    header: {
        height: 70,
        backgroundColor: '#194A4C',
        flexDirection: 'row',
        alignItems: 'center',
      },
})
