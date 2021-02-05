import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useNavigation } from '@react-navigation/native'
import React, { ReactPropTypes, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { IconButton, Portal, Searchbar, Surface } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import GroupCard from '../components/GroupCard_Small'
import { Text, View } from '../components/Themed'
import UserCard from '../components/UserCard_Small'
import {
  searchGroups,
  searchUsers,
  selectGroupResults,
  selectUserResults,
  resetGroups,
  resetUsers,
} from '../store/searchSlice'
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
  const { navigate } = useNavigation()

  const searchInputOnChange = (value) => setSearch(value)

  const RenderUsers = () =>
    Object.keys(results)?.map((id, key) => (
      <UserCard user={id} key={key} navigate={navigate} />
    ))

  const submit = () => dispatch(searchUsers(search))

  useEffect(() => {
    !search && dispatch(resetUsers())
  }, [search])

  return (
    <View style={{ flexDirection: 'column', flex: 1 }}>
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
  const results = useSelector(selectGroupResults)
  const dispatch = useDispatch()
  const { navigate } = useNavigation()

  const searchInputOnChange = (value) => setSearch(value)
  const createGroupPress = () => setVisible(true)
  const closeGroupAdd = () => setVisible(false)

  const submit = () => dispatch(searchGroups(search))

  const RenderGroups = () =>
    Object.keys(results)?.map((group, key) => (
      <GroupCard key={key} group={group} navigate={navigate} />
    ))

  useEffect(() => {
    !search && dispatch(resetGroups())
  }, [search])

  return (
    <View style={{ overflow: 'visible', flexDirection: 'column', flex: 1 }}>
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
          blurOnSubmit
          onSubmitEditing={submit}
        />
        <IconButton
          icon="plus-box"
          size={24}
          color="#194A4C"
          onPress={createGroupPress}
        />
      </Surface>
      <ScrollView>{results?.length ? <RenderGroups /> : <Empty />}</ScrollView>
      <Portal>{visible && <AddGroup goBack={closeGroupAdd} />}</Portal>
    </View>
  )
}

function Empty() {
  return (
    <View style={EmptyStyles.container}>
      <Text
        style={{
          color: '#D6D6D6',
          fontSize: 24,
          textAlign: 'center',
          marginBottom: 30,
          marginTop: 20,
        }}>
        Search {'\n'} for something ...
      </Text>
    </View>
  )
}

const EmptyStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
