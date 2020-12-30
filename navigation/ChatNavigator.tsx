import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import React, { useState } from 'react'
import AddChat from '../screens/AddChat'
import ChatList from '../screens/ChatList'
import ChatRoom from '../screens/ChatRoom'
import {View, Text, StatusBar, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import PrivateChatMenuOptions from '../components/Custom/PrivateChatMenuOptions'
import { useDispatch, useSelector } from 'react-redux'
import { searchUsers } from '../store/chatSlice'
//import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

const Stack = createStackNavigator()

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
  headerTintColor: '#fff',
  headerStatusBarHeight: StatusBar.currentHeight,
}

export default function ChatStack({navigation}) {
  const dispatch = useDispatch()
  const [showState, setShowState] = useState(false);
  const btn = () => { 
    return (<Text></Text>)
  }
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="ChatList" 
        component={ChatList} 
        options={{ headerTitle: 'Messages',
        headerLeft: () =>
          <View>
            <IconButton 
              icon="chevron-left"
              onPress={() => {setShowState(false); navigation.navigate('Home')}}
              size={30}
              color="#fff"
            />
          </View>,
        headerRight: ({ tintColor }) => (
          <View>
            <IconButton
              icon="message-plus"
              color={tintColor}
              size={22}
              onPress={async () => { 
                await dispatch(searchUsers('')); 
                navigation.navigate('AddChat', { 
                  showState, setShowState 
                })} 
              }
            />
          </View>
        ),
        headerRightContainerStyle: {
          marginRight: 5,
        }}}
      />
      <Stack.Screen name="ChatRoom"
        component={ChatRoom}
        options={({ route }) => ({
          title: route.params.title,
          headerTitleAlign: 'left',
          headerRight: ({ tintColor }) => (
            <View style={styles.iconRight}>
              <PrivateChatMenuOptions />
            </View>
          )})}/>
      <Stack.Screen name="AddChat"
          component={AddChat}
          options={{ 
            headerTitle: 'Nouvelle discussion',
            headerRight: ({ tintColor }) => 
              { return !showState ?
              <>
                <TouchableWithoutFeedback onPress={() => console.log('Pressed')}>
                  <View style={{marginRight: 10}}>
                    <Text style={{fontSize: 14, color: tintColor}}></Text>
                  </View>
                </TouchableWithoutFeedback>
              </>
              :
              <TouchableWithoutFeedback onPress={() => console.log('Pressed')}>
                  <View style={{marginRight: 10}}>
                    <Text style={{fontSize: 14, color: tintColor}}>Ajouter</Text>
                  </View>
                </TouchableWithoutFeedback>
            }
      }}/>
    </Stack.Navigator> 
  )
}

const styles = StyleSheet.create({
  iconRight: {
    backgroundColor: '#194A4C',
    paddingTop: 5,
    paddingEnd: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'flex-end',
  },
})