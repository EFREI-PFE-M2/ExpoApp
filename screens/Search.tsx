import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { ReactPropTypes, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { IconButton, Searchbar, Surface } from 'react-native-paper'
import { Text, View } from '../components/Themed'

const Tab = createMaterialTopTabNavigator()

export default function Search(props: ReactPropTypes) {
  return (
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
        showLabel: true,
        showIcon: true,
        tabStyle: {
          flexDirection: 'row',
        },
      }}>
      <Tab.Screen name="Utilisateurs" component={UserTab} />
      <Tab.Screen name="Groupes" component={GroupTab} />
    </Tab.Navigator>
  )
}

function UserTab() {
  const [search, setSearch] = useState('')

  const searchInputOnChange = (value) => setSearch(value)

  return (
    <View>
      <Searchbar
        placeholder="Chercher un utilisateur"
        placeholderTextColor="#757575"
        onChangeText={searchInputOnChange}
        value={search}
        icon="account-search"
        iconColor="#194A4C"
        inputStyle={{ color: '#000' }}
      />
      <ScrollView>
        <Text>Content</Text>
      </ScrollView>
    </View>
  )
}

function GroupTab() {
  const [search, setSearch] = useState('')

  const searchInputOnChange = (value) => setSearch(value)

  return (
    <View style={{ overflow: 'visible' }}>
      <Surface style={{ flexDirection: 'row', width: '100%', elevation: 4 }}>
        <Searchbar
          placeholder="Chercher un groupe"
          placeholderTextColor="#757575"
          onChangeText={searchInputOnChange}
          value={search}
          icon="account-search"
          iconColor="#194A4C"
          inputStyle={{ color: '#000' }}
          style={{ flex: 1, elevation: 0 }}
        />
        <IconButton icon="plus-box" size={24} color="#194A4C" />
      </Surface>
      <ScrollView>
        <Text>Content</Text>
      </ScrollView>
    </View>
  )
}