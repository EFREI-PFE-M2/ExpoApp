import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import React, { useState } from 'react'
import AddChat from '../screens/Chat/AddChat'
import AddGroupChat from '../screens/Chat/GroupChatDetails'
import ChatList from '../screens/Chat/ChatList'
import ChatRoom from '../screens/Chat/ChatRoom'
import { View, Text, StatusBar, StyleSheet, Alert } from 'react-native'
import { IconButton } from 'react-native-paper'
import PrivateChatMenuOptions from '../components/Custom/PrivateChatMenuOptions'
import { useDispatch, useSelector } from 'react-redux'
import { createConversation, createGroupConversation, getConversationFromID, getGroupConversationFromID, searchUsers, selectGroupChatInfo, selectUsers, selectUsersToAdd } from '../store/chatSlice'
import { selectCurrentUser } from '../store/userSlice'
import GroupChatMenuOptions from '../components/Custom/GroupChatMenuOption'
import GroupChatDetails from '../screens/Chat/GroupChatDetails'

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
  
  const [showState, setShowState] = useState(false)

  const displayUser = useSelector(selectCurrentUser)
  const selectUsersIn = useSelector(selectUsersToAdd)
  
  const { uid } = displayUser              
  const dispatch = useDispatch()

  dispatch(getConversationFromID(uid))
  dispatch(getGroupConversationFromID(uid))

  const goBackToChatList = () => {
    setShowState(false)
    navigation.navigate('ChatList')
    dispatch(selectUsers(null)) 
  }

  const createChat = () => {
    const length = Object.keys(selectUsersIn).length 
    if (length > 1) {
      navigation.navigate('GroupChatDetails', {title: 'Créer un chat de groupe', isCreated: false})
    } else {
      if (length) {
        const receiver = Object.values(selectUsersIn)[0]
        dispatch(createConversation(uid, receiver.uid))
        goBackToChatList()
      }  
    }
  }

  const groupChatInfo = useSelector(selectGroupChatInfo)
  const createGroupChat = () => {
    if (groupChatInfo.name.trim() != '') {
      dispatch(createGroupConversation(uid, groupChatInfo))
      goBackToChatList()
    } else {
      alert('Enter a name for your group chat')
    }
  }

  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="ChatList" 
        component={ChatList} 
        options={{ 
          headerTitle: 'Messages',
          headerLeft: () =>
            <View>
              <IconButton 
                icon="chevron-left"
                onPress={() => { navigation.navigate('Home')}}
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
          title: route.params?.title,
          headerTitleAlign: 'left',
          headerRight: ({ tintColor }) => (
            <View style={styles.iconRight}>
              {route.params?.isPrivateChat ? 
                <PrivateChatMenuOptions params={{chatInfo: route.params?.chatInfo}}/> 
                :
                <GroupChatMenuOptions params={{chatInfo: route.params?.chatInfo}}/>
             }
            </View>
          )})}/>
      <Stack.Screen name="AddChat"
        component={AddChat}
        options={{ 
          headerTitle: 'Nouvelle discussion',
          headerLeft: ({ tintColor }) => (
            <IconButton 
              icon="chevron-left"
              onPress={goBackToChatList}
              size={30}
              color="#fff"
            />
          ),
          headerRight: ({ tintColor }) => 
            { return !showState ?
              <>
                {null}
              </>
              :
              <IconButton icon='account-plus' style={{marginRight: 7}} size={24} onPress={createChat}/>
            }
      }}/>
      <Stack.Screen name="GroupChatDetails"
        component={GroupChatDetails}
        options={({route}) => ({ 
          headerTitleStyle: {fontSize: 20},
          headerTitle: route.params?.title,
          headerLeft: ({ tintColor }) => 
            route.params?.isCreated ?
              <IconButton 
                icon="chevron-left"
                onPress={() => navigation.navigate('ChatRoom', {chatInfo: route.params?.chatInfo, isPrivate: false})}
                size={30}
                color="#fff"
              /> :
              <IconButton 
                icon="chevron-left"
                onPress={goBackToChatList}
                size={30}
                color="#fff"
              />
          ,
          headerRight: ({ tintColor }) => 
            route.params?.isCreated ?
              <IconButton 
                icon='check' 
                style={{marginRight: 7}} 
                size={24} 
                onPress={() => navigation.navigate('ChatRoom', {chatInfo: route.params?.chatInfo, isPrivate: false})}
              />  :
              <IconButton 
                icon='check' 
                style={{marginRight: 7}} 
                size={24} 
                onPress={createGroupChat}
              /> 
      })}/>
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