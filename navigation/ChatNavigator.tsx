import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import AddChat from '../screens/Chat/AddChat'
import ChatList from '../screens/Chat/ChatList'
import ChatRoom from '../screens/Chat/ChatRoom'
import { View, StatusBar, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import PrivateChatMenuOptions from '../components/Custom/PrivateChatMenuOptions'
import { useDispatch, useSelector } from 'react-redux'
import { 
  addUsersToGroupChatAfterCreation, 
  createConversation, 
  createGroupConversation, 
  searchUsers, 
  selectGroupChatInfo, 
  selectUsers, 
  selectUsersToAdd } 
from '../store/chatSlice'
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

export default function ChatStack(props: any) {
  const [showState, setShowState] = useState(false)
  const { navigation } = props

  const displayUser = useSelector(selectCurrentUser)
  const selectUsersIn = useSelector(selectUsersToAdd)
  
  const { uid } = displayUser              
  const dispatch = useDispatch()

  // Callbacks using constants
  
  const goBackToHome = () => navigation.navigate('Home')

  const goToChatRoom = () => navigation.navigate('ChatRoom')

  const goBackToGroupChatDetails = () => navigation.navigate('GroupChatDetails')

  const goBackToChatList = async () => {
    setShowState(false)
    await dispatch(selectUsers()) 
    navigation.navigate('ChatList')
  }

  const searchUsersToCreateChat = async () => { 
    await dispatch(searchUsers('')); 
    navigation.navigate('AddChat', { 
      title: 'Nouvelle discussion', 
      isCreated: false, 
      setShowState 
    })}

  const createChat = async () => {
    const length = Object.keys(selectUsersIn).length 
    if (length > 1) {
      navigation.navigate('GroupChatDetails', {title: 'Créer un chat de groupe', isCreated: false})
    } else {
      if (length) {
        const receiver = Object.values(selectUsersIn)[0]
        await dispatch(createConversation(uid, receiver.uid))
        goBackToChatList()
      }  
    }
  }

  const searchForUsersToAddToGroupChat = ({chatInfo}: any) => async () => {
    await dispatch(searchUsers('', chatInfo.chatID))
    navigation.navigate('AddChat', { 
      title: 'Nouveaux invités',
      groupChatID: chatInfo.chatID,
      alreadyInvitedUsers: chatInfo.users, isCreated: true })
  }

  const addMembersToGroupChat = ({groupChatID}: any) => async () => { 
    if (Object.keys(selectUsersIn).length != 0)
      await dispatch(addUsersToGroupChatAfterCreation(groupChatID, selectUsersIn))
    navigation.navigate('ChatRoom')
  }

  const groupChatInfo = useSelector(selectGroupChatInfo)
  const createGroupChat = async () => {
    if (groupChatInfo.name.trim() != '') {
      await dispatch(createGroupConversation(uid, groupChatInfo))
      goBackToChatList()
    } else {
      alert('Enter a name for your group chat')
    }
  }

  // HeaderLeft/Right Buttons

  const ChatListHeaderLeft = () => 
    <IconButton 
      icon="chevron-left"
      color="#fff"
      size={30}
      onPress={goBackToHome}
    />

  const ChatListHeaderRight = () => 
    <IconButton
      icon="message-plus"
      color="#fff"
      size={22}
      onPress={searchUsersToCreateChat}
    />

  const ChatRoomHeaderRight = ({props}: any) => () =>
      <View style={styles.iconRight}>
        {props.isPrivateChat ? 
          <PrivateChatMenuOptions params={{chatInfo: props.chatInfo}}/> 
          :
          <GroupChatMenuOptions params={{chatInfo: props.chatInfo}}/>
        }
      </View>

  const AddChatHeaderLeft = ({props}: any) => () => 
    props.isCreated ? 
      <IconButton 
        icon="chevron-left"
        onPress={goBackToGroupChatDetails}
        size={30}
        color="#fff"
      />  
      : 
      <IconButton 
        icon="chevron-left"
        onPress={goBackToChatList}
        size={30}
        color="#fff"
      />  
  

  const AddChatHeaderRight = ({props}: any) => () =>
    props.isCreated ? 
      <IconButton 
          icon='check' 
          style={{marginRight: 7}} 
          size={24} 
          onPress={addMembersToGroupChat({groupChatID: props.groupChatID})}
      /> 
      :
      !showState ?
        <>
          {null}
        </>
        :
        <IconButton 
          icon='account-plus' 
          style={{marginRight: 7}} 
          size={24} 
          onPress={createChat}
      />

  const GroupChatDetailsHeaderLeft = ({props}: any) => () =>
    props.isCreated ?
      <IconButton 
      icon="chevron-left"
      onPress={goToChatRoom}
      size={30}
      color="#fff"
    /> :
    <IconButton 
      icon="chevron-left"
      onPress={goBackToChatList}
      size={30}
      color="#fff"
    />         
    
  const GroupChatDetailsHeaderRight = ({props}: any) => () =>
  props.isCreated ?
    props.chatInfo.hostID === uid ?
      <IconButton 
        icon='account-plus' 
        style={{marginRight: 7}} 
        size={24} 
        onPress={searchForUsersToAddToGroupChat({chatInfo: props.chatInfo})}
      />  
      :
      <IconButton 
        icon='check' 
        style={{marginRight: 7}} 
        size={24} 
        onPress={goToChatRoom}
      />     
      :
      <IconButton 
        icon='check' 
        style={{marginRight: 7}} 
        size={24} 
        onPress={createGroupChat}
      /> 
    
 
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="ChatList" 
        component={ChatList} 
        options={{ 
          headerTitle: 'Messages',
          headerLeft: ChatListHeaderLeft,
          headerRight: ChatListHeaderRight,
        headerRightContainerStyle: {
          marginRight: 5,
        }}}
      />

      <Stack.Screen name="ChatRoom"
        component={ChatRoom}
        options={({ route }) => ({
          title: route.params?.title,
          headerTitleAlign: 'left',
          headerRight: ChatRoomHeaderRight({props: route.params})
        })}/>

      <Stack.Screen name="AddChat"
        component={AddChat}
        options={({route}) => ({ 
          headerTitle: route.params?.title,
          headerLeft: AddChatHeaderLeft({props: route.params}),
          headerRight: AddChatHeaderRight({props: route.params})
      })}/>

      <Stack.Screen name="GroupChatDetails"
        component={GroupChatDetails}
        options={({route}) => ({ 
          headerTitleStyle: {fontSize: 20},
          headerTitle: route.params?.title,
          headerLeft: GroupChatDetailsHeaderLeft({props: route.params}),
          headerRight: GroupChatDetailsHeaderRight({props: route.params})
      })}/>
    </Stack.Navigator> 
  )
}

const styles = StyleSheet.create({
  marginRight: {
    marginRight: 7
  },
  iconRight: {
    backgroundColor: '#194A4C',
    paddingTop: 5,
    paddingEnd: 10,
  }
})