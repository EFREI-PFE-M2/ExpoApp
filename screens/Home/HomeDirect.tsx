import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { IconButton, Menu, TouchableRipple } from 'react-native-paper'
import { View, Text } from '../../components/Themed'
import moment from 'moment'
import { MaterialIcons } from '@expo/vector-icons'
import RaceCard from '../../components/RaceCard'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { selectRaces, updateRaces } from '../../store/raceSlice'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar'

const WEEKDAYS = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']

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
    <>
      <DatePicker date={date} setDate={setDate}/>
      <ScrollView style={styles.container}>
        <View>
          {races?.map((race, key) => (
            <RaceCard race={race} key={key} />
          ))}
        </View>
    </ScrollView>
  </>
  )
}

function DatePicker(props) {

  const {setDate, date } = props

  const [visible, setVisible] = useState(false)

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const dispatch = useDispatch()


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
 
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
 
  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };



  return (
    <View style={styles.datePickerContainer}>
      <View style={styles.dateContainer}>
        <View style={{flexDirection: 'row', flexGrow: 1, alignItems: 'center'}}>
          <Text style={styles.date}>
            {date && date.getDay() == new Date().getDay() ? `Aujourd'hui` : (date && WEEKDAYS[date.getDay()])}
          </Text>
          <Text>{date && `${date.getDate()}/${date.getMonth()}/${date.getYear()}`}</Text>
        </View>
        <View>
          <IconButton icon="chevron-down" size={24} color="#BEC2C4" onPress={showDatePicker}/>
          <DateTimePickerModal
            date={date}
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {},
  datePickerContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderStyle: 'solid',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  titleStyle: {
    color: '#000',
  },
})
