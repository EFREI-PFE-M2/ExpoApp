import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ChatList from '../screens/ChatList'
import ChatRoom from '../screens/ChatRoom'

const Stack = createStackNavigator()

export default function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Stack.Navigator>
  )
}
