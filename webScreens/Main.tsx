import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { View } from '../components/Themed'
import Home from './Home'
import Header from './Header'
import Profile from './Profile'
import { StyleSheet } from 'react-native'

const Stack = createStackNavigator()

export default function Main() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={{ flex: 1, width: '100%' }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Accueil" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
})
