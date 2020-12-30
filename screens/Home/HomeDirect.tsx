import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { IconButton, Menu, TouchableRipple } from 'react-native-paper'
import { View, Text } from '../../components/Themed'
import moment from 'moment'
import { MaterialIcons } from '@expo/vector-icons'
import RaceCard from '../../components/RaceCard'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { getInitRaces } from '../../store/raceSlice'

const TODAY = `Aujourd'hui`
const TOMORROW = 'Demain'
const WEEK = 'Cette semaine'

export default function HomeDirect() {
  const races = useSelector(({ race }) => race.races)
  const dispatch = useDispatch()

  return (
    <ScrollView style={styles.container}>
      <DatePicker />
      <View>
        {races?.map((race, key) => (
          <RaceCard raceID={race.id} key={key} />
        ))}
      </View>
    </ScrollView>
  )
}

function DatePicker() {
  const [visible, setVisible] = useState(false)
  const [choice, setChoice] = useState(TODAY)
  const dispatch = useDispatch()

  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const onDismiss = () => setVisible(false)
  const onSelectToday = () => {
    setChoice(TODAY)
    dispatch(getInitRaces(today.toLocaleString()))
    onDismiss()
  }
  const onSelectTomorrow = () => {
    setChoice(TOMORROW)
    dispatch(getInitRaces(tomorrow.toDateString()))
    onDismiss()
  }
  const onSelectWeek = () => {
    setChoice(WEEK)
    onDismiss()
  }

  const anchor = (
    <TouchableRipple onPress={() => setVisible(true)}>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{choice}</Text>
        <IconButton icon="chevron-down" size={24} color="#BEC2C4" />
      </View>
    </TouchableRipple>
  )

  return (
    <View style={styles.datePickerContainer}>
      <Menu visible={visible} onDismiss={onDismiss} anchor={anchor}>
        <MenuItem
          title={TODAY}
          onPress={onSelectToday}
          titleStyle={styles.titleStyle}
          selected={choice === TODAY}
        />
        <MenuItem
          title={TOMORROW}
          onPress={onSelectTomorrow}
          titleStyle={styles.titleStyle}
          selected={choice === TOMORROW}
        />
        <MenuItem
          title={WEEK}
          onPress={onSelectWeek}
          titleStyle={styles.titleStyle}
          selected={choice === WEEK}
        />
      </Menu>
    </View>
  )
}

function MenuItem(props) {
  const style = {
    backgroundColor: props.selected ? '#194A4C' : null,
  }
  return <Menu.Item style={style} {...props} />
}

const styles = StyleSheet.create({
  container: {},
  datePickerContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderStyle: 'solid',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  titleStyle: {
    color: '#000',
  },
})
