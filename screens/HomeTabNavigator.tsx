import React, { useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import HomeDirect from './Home/HomeDirect'
import HomeSubFeed from './Home/HomeSubFeed'
import HomeGroups from './Home/HomeGroups'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View } from './../components/Themed'
import { Dialog, FAB, Portal } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import NewPost from '../components/NewPost'

const Tab = createMaterialTopTabNavigator()

export default function HomeTabNavigator() {
  const [openFab, setOpenFab] = useState(false)

  const fabOnPress = () => setOpenFab(prevState => !prevState)

  return (
    <>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#194A4C',
          },
          indicatorStyle: {
            backgroundColor: '#194A4C',
          },
          scrollEnabled: true,
          showLabel: true,
          showIcon: true,
          tabStyle: {
            flexDirection: 'row',
          },
        }}>
        <Tab.Screen
          name="Direct"
          component={HomeDirect}
          options={{
            tabBarIcon: () => (
              <MaterialCommunityIcons name="fire" size={24} color="#194A4C" />
            ),
          }}
        />
        <Tab.Screen
          name="SubFeed"
          component={HomeSubFeed}
          options={{ title: 'Abonnements' }}
        />
        <Tab.Screen
          name="Groups"
          component={HomeGroups}
          options={{ title: 'Groupes' }}
        />
      </Tab.Navigator>
      <FAB
        style={styles.fab}
        icon="pen"
        onPress={fabOnPress}
      />
      <Portal>
        {openFab && <NewPost onClose={fabOnPress} />}
      </Portal>
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
