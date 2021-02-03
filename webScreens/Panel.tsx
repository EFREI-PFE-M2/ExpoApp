import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { View } from '../components/Themed'
import HomeTabNavigator from '../screens/HomeTabNavigator'

const Stack = createStackNavigator()

export default function Panel({ current }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={HomeTabNavigator} />
    </Stack.Navigator>
  )
}
