import React from 'react'
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer'
import BottomTabNavigator from '../../navigation/BottomTabNavigator'
import DrawerProfile from './DrawerProfile'
import { Entypo, MaterialIcons } from '@expo/vector-icons'
import Profile from './Profile'
import Settings from '../Settings'
import Help from '../Help'
import { useDispatch } from 'react-redux'
import { logout } from './../../store/userSlice'
import { StyleSheet } from 'react-native'
import ChatNavigator from './../../navigation/ChatNavigator'

const Drawer = createDrawerNavigator()

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const dispatch = useDispatch()
  const logoutHandler = () => dispatch(logout())

  return (
    <DrawerContentScrollView>
      <DrawerProfile />
      <DrawerItemList
        labelStyle={styles.labelStyle}
        inactiveTintColor="#fff8"
        activeTintColor="#fff"
        {...props}
      />
      <DrawerItem
        label="Déconnexion"
        onPress={logoutHandler}
        labelStyle={styles.logoutStyle}
        style={styles.logoutContainer}
      />
    </DrawerContentScrollView>
  )
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Default"
      drawerStyle={{ backgroundColor: '#194A4C' }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Entypo name="home" color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profil"
        component={Profile}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="person-outline" size={24} color={color} />
          ),
        }}
        initialParams={{ self: true }}
      />
      <Drawer.Screen
        name="Message"
        component={ChatNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="message" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Réglages"
        component={Settings}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Centre d'assistance"
        component={Help}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="question-answer" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 18,
  },
  logoutStyle: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  logoutContainer: {
    marginTop: 100,
    backgroundColor: '#fff9',
    flex: 1,
  },
})