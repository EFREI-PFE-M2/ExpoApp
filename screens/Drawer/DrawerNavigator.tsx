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
import { Entypo } from '@expo/vector-icons'

const Drawer = createDrawerNavigator()

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const labelStyle = {
    fontSize: 18,
  }

  return (
    <DrawerContentScrollView>
      <DrawerProfile />
      <DrawerItemList labelStyle={labelStyle} {...props} />
      <DrawerItem label="Help" onPress={() => alert('Link to help')} />
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
    </Drawer.Navigator>
  )
}
