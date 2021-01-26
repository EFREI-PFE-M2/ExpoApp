import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import React, { useState } from 'react'
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
  getConversationFromID, 
  getGroupConversationFromID, 
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

  dispatch(getConversationFromID(uid))
  dispatch(getGroupConversationFromID(uid))

  // Callbacks using constants
  
  const goBackToHome = () => navigation.navigate('Home')

  const goToChatRoom = () => navigation.navigate('ChatRoom')

  const goBackToGroupChatDetails = () => navigation.navigate('GroupChatDetails')

  const goBackToChatList = () => {
    setShowState(false)
    navigation.navigate('ChatList')
    dispatch(selectUsers()) 
  }

  const searchUsersToCreateChat = () => { 
    dispatch(searchUsers('')); 
    navigation.navigate('AddChat', { 
      title: 'Nouvelle discussion', 
      isCreated: false, 
      setShowState 
    })}

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

  const searchForUsersToAddToGroupChat = (chatInfo: any) => () => {
    dispatch(searchUsers('', chatInfo.users))
    navigation.navigate('AddChat', { 
      title: 'Nouveaux invités',
      groupChatID: chatInfo.chatID,
      alreadyInvitedUsers: chatInfo.users, isCreated: true })
  }

  const addMembersToGroupChat = () => { 
    //await dispatch(addUsersToGroupChatAfterCreation(route.params?.groupChatID, selectUsersIn))
    navigation.navigate('GroupChatDetails')
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

  // HeaderLeft/Right Buttons

  /*const AddChatHeaderLeftBtn = ({props}: any) => {
    return props.isCreated ? 
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
  }

  const AddChatHeaderRightBtn = ({props}: any) => 
  {
    return props.isCreated ? 
      <IconButton 
          icon='check' 
          style={{marginRight: 7}} 
          size={24} 
          onPress={addMembersToGroupChat}
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
  }

  const GroupChatDetailsHeaderLeftBtn = ({props}: any) =>
  {
    return props.isCreated ?
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
  } 

  const GroupChatDetailsHeaderRightBtn = ({props}: any) =>
  {
    return props.isCreated ?
      props.chatInfo.hostID === uid ?
      (<IconButton 
      icon='account-plus' 
      style={{marginRight: 7}} 
      size={24} 
      onPress={searchForUsersToAddToGroupChat(props.chatInfo)}
      />)
      :
      (<IconButton 
        icon='check' 
        style={{marginRight: 7}} 
        size={24} 
        onPress={goToChatRoom}
      />     )
      :
      (<IconButton 
        icon='check' 
        style={{marginRight: 7}} 
        size={24} 
        onPress={createGroupChat}
      /> )  
  }  */

 
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name="ChatList" 
        component={ChatList} 
        options={{ 
          headerTitle: 'Messages',
          headerLeft: () => 
          <IconButton 
            icon="chevron-left"
            color="#fff"
            size={30}
            onPress={goBackToHome}
          />,
          headerRight: () => 
          <IconButton
            icon="message-plus"
            color="#fff"
            size={22}
            onPress={searchUsersToCreateChat}
          />,
        headerRightContainerStyle: {
          marginRight: 5,
        }}}
      />

      <Stack.Screen name="ChatRoom"
        component={ChatRoom}
        options={({ route }) => ({
          title: route.params?.title,
          headerTitleAlign: 'left',
          headerRight: () => 
          <View style={styles.iconRight}>
            {route.params?.isPrivateChat ? 
              <PrivateChatMenuOptions params={{chatInfo: route.params?.chatInfo}}/> 
              :
              <GroupChatMenuOptions params={{chatInfo: route.params?.chatInfo}}/>
            }
          </View>
        })}/>

      <Stack.Screen name="AddChat"
        component={AddChat}
        options={({route}) => ({ 
          headerTitle: route.params?.title,
          headerLeft: () => route.params?.isCreated ? 
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
          />,
          headerRight: () => route.params?.isCreated ? 
          <IconButton 
              icon='check' 
              style={styles.marginRight} 
              size={24} 
              onPress={addMembersToGroupChat}
          /> 
          :
          !showState ?
            <>
              {null}
            </>
            :
            <IconButton 
              icon='account-plus' 
              style={styles.marginRight} 
              size={24} 
              onPress={createChat}
          />
      })}/>

      <Stack.Screen name="GroupChatDetails"
        component={GroupChatDetails}
        options={({route}) => ({ 
          headerTitleStyle: {fontSize: 20},
          headerTitle: route.params?.title,
          headerLeft: () => route.params?.isCreated ?
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
          />,
          headerRight: () => route.params?.isCreated ?
          route.params?.chatInfo.hostID === uid ?
            <IconButton 
            icon='account-plus' 
            style={styles.marginRight} 
            size={24} 
            onPress={searchForUsersToAddToGroupChat(route.params?.chatInfo)}
            />
            :
            <IconButton 
              icon='check' 
              style={styles.marginRight} 
              size={24} 
              onPress={goToChatRoom}
            />     
            :
            <IconButton 
              icon='check' 
              style={styles.marginRight} 
              size={24} 
              onPress={createGroupChat}
            />
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