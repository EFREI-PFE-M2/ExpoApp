import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import React from 'react'
import AddChat from '../screens/AddChat'
import ChatList from '../screens/ChatList'
import ChatRoom from '../screens/ChatRoom'
import {View, StatusBar, StyleSheet} from 'react-native'
import { IconButton } from 'react-native-paper'
import PrivateChatMenuOptions from '../components/Custom/PrivateChatMenuOptions'


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
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="ChatList" 
        component={ChatList} 
        options={{ headerTitle: 'Messages',
        headerLeft: () =>
          <View>
            <IconButton 
              icon="chevron-left"
              onPress={() => navigation.navigate('Home')}
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
              onPress={() => navigation.navigate('AddChat')}
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
            headerTitle: 'Nouvelle discussion'
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