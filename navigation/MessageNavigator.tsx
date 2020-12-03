import React from 'react'
import { StatusBar, View } from 'react-native'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import ChatRoom from '../screens/ChatRoom'
import { MaterialIcons } from '@expo/vector-icons'

const MessageStack = createStackNavigator()
const defaultScreenOptions: StackNavigationOptions = {
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#194A4C',
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerStatusBarHeight: StatusBar.currentHeight,
}

export default function MessageNavigator() {
  return (
    <MessageStack.Navigator 
    screenOptions={{...defaultScreenOptions, headerShown: true}}>
      
     <MessageStack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{ headerTitle: 'ChatRoom', headerRight: ({ tintColor }) => (
          <View style={{paddingTop: 5, paddingEnd: 10}}> 
                <MaterialIcons name="more-vert" color={tintColor} size={24} onPress={() => {
              // Do something
                }}/>
              </View> 
        ),
        headerTintColor: '#fff',}}
      />
    </MessageStack.Navigator>
  )
}