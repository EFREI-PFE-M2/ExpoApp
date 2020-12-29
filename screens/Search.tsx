import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useNavigation } from '@react-navigation/native'
import React, { ReactPropTypes, useState } from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { IconButton, Portal, Searchbar, Surface } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { Text, View } from '../components/Themed'
import UserCard from '../components/UserCard_Small'
import { searchUsers, selectUserResults } from '../store/searchSlice'
import AddGroup from './AddGroup'

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
  const results = useSelector(selectUserResults)
  const dispatch = useDispatch()

  const searchInputOnChange = (value) => setSearch(value)

  const RenderUsers = () =>
    results?.map((user, key) => <UserCard user={user} key={key} />)

  const submit = () => dispatch(searchUsers(search))

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
        style={{ zIndex: 1 }}
        blurOnSubmit
        onSubmitEditing={submit}
      />
      <ScrollView>{results?.length ? <RenderUsers /> : <Empty />}</ScrollView>
    </View>
  )
}

function GroupTab() {
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(false)

  const searchInputOnChange = (value) => setSearch(value)
  const createGroupPress = () => setVisible(true)
  const closeGroupAdd = () => setVisible(false)

  return (
    <View style={{ overflow: 'visible' }}>
      <Surface
        style={{
          flexDirection: 'row',
          width: '100%',
          elevation: 4,
          zIndex: 1,
        }}>
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
        <IconButton
          icon="plus-box"
          size={24}
          color="#194A4C"
          onPress={createGroupPress}
        />
      </Surface>
      <ScrollView>
        <Empty />
      </ScrollView>
      <Portal>{visible && <AddGroup goBack={closeGroupAdd} />}</Portal>
    </View>
  )
}

function Empty() {
  return (
    <View style={EmptyStyles.container}>
      <Text>Search for something ...</Text>
    </View>
  )
}

const EmptyStyles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
