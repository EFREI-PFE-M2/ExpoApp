import { useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { View } from '../components/Themed'
import ChatStack from '../navigation/ChatNavigator'
import Profile from '../screens/Drawer/Profile'
import Group from '../screens/Group'
import Help from '../screens/Help'
import HomeTabNavigator from '../screens/HomeTabNavigator'
import Settings from '../screens/Settings'
import { TabCardGameNavigator } from './../navigation/BottomTabNavigator'

const Stack = createStackNavigator()

export default function Panel({ current }) {
  const { navigate } = useNavigation()

  useEffect(() => {
    navigate(current)
  }, [current])

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Accueil" component={HomeTabNavigator} />
      <Stack.Screen name="Messages" component={ChatStack} />
      <Stack.Screen name="Cartes" component={TabCardGameNavigator} />
      <Stack.Screen name="Réglages" component={Settings} />
      <Stack.Screen name="Centre d'assistance" component={Help} />
      <Stack.Screen name="Home_Group" component={Group} />
      <Stack.Screen name="Profil" component={Profile} />
    </Stack.Navigator>
  )
}
