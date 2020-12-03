import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { ColorSchemeName } from 'react-native'

import NotFoundScreen from '../screens/NotFoundScreen'
import LinkingConfiguration from './LinkingConfiguration'

import SignIn from './../screens/SignIn'
import SignUp from './../screens/SignUp'
import BottomTabNavigator from './BottomTabNavigator'
import MessageNavigator from './MessageNavigator'
import DrawerNavigator from '../screens/Drawer/DrawerNavigator'
import RetrievePassword from '../screens/RetrievePassword'
import ResetPassword from '../screens/ResetPassword'
import TermsOfUse from '../screens/TermsOfUse'
import useUser from './../hooks/useUser'

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createStackNavigator()

function RootNavigator() {
  const user = useUser()
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SignIn">
      {user ? (
        <>
          <Stack.Screen name="Root" component={BottomTabNavigator} />
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
          <Stack.Screen name="ChatRoom" component={MessageNavigator}/>
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="RetrievePassword" component={RetrievePassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </>
      )}
      <Stack.Screen name="TermsOfUse" component={TermsOfUse} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
    </Stack.Navigator>
  )
}
