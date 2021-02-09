import React, { useEffect, useState } from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { StyleSheet, View, Text } from 'react-native'
import { IconButton } from 'react-native-paper'

const WEEKDAYS = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']

export default function DatePicker(props) {

    const {setDate, date } = props
  
    const [visible, setVisible] = useState(false)
  
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
  
  
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
              {date && isSameDay(date, new Date()) ? `Aujourd'hui` : (date && WEEKDAYS[date.getDay()])}
            </Text>
            <Text>{date && `${fillZero(date.getDate())}/${fillZero(date.getMonth()+1)}/${date.getFullYear()}`}</Text>
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
  
  function fillZero(value){
      return value < 10 ? `0${value}` : value
  }
  
  function isSameDay(first, second){
        return first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate();
  }
  
  
  const styles = StyleSheet.create({
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
    }
  })