import React, { useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import GameDeck from './Game/GameDeck'
import GameLauncher from './Game/GameLauncher'
import { StyleSheet } from 'react-native'

const Tab = createMaterialTopTabNavigator()

export default function GameTabNavigator() {


  return (
    <>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#194A4C',
          },
          indicatorStyle: {
            backgroundColor: '#194A4C',
          },
          //scrollEnabled: true,
          showLabel: true,
          showIcon: true,
          tabStyle: {
            flexDirection: 'row',
          },
        }}>
        <Tab.Screen
          name="Mon deck"
          component={GameDeck}
          options={{ title: 'Mon deck' }}
        />
        <Tab.Screen
          name="Jouer"
          component={GameLauncher}
          options={{ title: 'Jouer' }}
        />
      </Tab.Navigator>
    </>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  }
})
