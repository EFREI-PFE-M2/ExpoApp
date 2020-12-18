import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useSelector } from 'react-redux'
import { Text, View } from './../components/Themed'

export default function Group({ route }) {
  const { groupID } = route.params
  const { name } = useSelector((state) => state.group?.groups[groupID])
  return (
    <View>
      <Text>{name}</Text>
    </View>
  )
}
