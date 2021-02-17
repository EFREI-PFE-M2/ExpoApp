import React, { useEffect, useState } from 'react'
import { View } from '../../components/Themed'
import { StyleSheet, ScrollView, Text, TouchableOpacity, RefreshControl } from 'react-native'
import { Avatar } from 'react-native-paper'
import {
  GetMessageShort,
  GetRoomTitleShort,
  GetPublishedDate,
  wait,
  checkMessageType,
} from '../../utils/ChatFunctions'
import { useDispatch, useSelector } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import {
  selectPrivateChats,
  getMessagesFromPrivateConversation,
  selectGroupChats,
  getMessagesFromGroupConversation,
  getConversationFromID,
  getGroupConversationFromID,
} from '../../store/chatSlice'
import { selectCurrentUser } from '../../store/userSlice'
import constants from '../../constants/ChatConstants'

function PrivateChatList(props: any) {
  const displayUser = useSelector(selectCurrentUser)
  const { uid } = displayUser

  const dispatch = useDispatch()

  const privateChats = useSelector(selectPrivateChats)
  const [privateConversations, setPrivateConversations] = useState(privateChats)

  useEffect(() => {
    setRefreshing(true);
    setPrivateConversations(privateChats);
    wait(2000).then(() => setRefreshing(false));
  }, [privateChats])

  const { navigation } = props

  const [refreshing, setRefreshing] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>()
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));  
  }, []);

  const redirectToPrivateChatRoom = ({props}: any) => async () => 
  {
    await dispatch(getMessagesFromPrivateConversation(props.chatID))
    navigation.navigate('ChatRoom', {
      isPrivateChat: true,
      chatInfo: props.chatInfo,
      title: (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(0, 0, 0, 0)',
          }}>
          <Avatar.Image size={45} source={{ uri: props.photoURL }} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              marginBottom: 5,
              backgroundColor: 'rgba(0, 0, 0, 0)',
            }}>
            <Text style={styles.titleStyle}>
              {props.displayName}
            </Text>
          </View>
        </View>
      ),
    })
  }

  const privateConversationsList = () =>
    {
      return Object.keys(privateConversations).length == 0 ? 
      (
        null
      ) : 
      <View style={{backgroundColor: 'rgba(0,0,0,0)'}}>
        {Object.keys(privateConversations).map((key) => {
          const chatInfo = { ...privateConversations[key], chatID: key }        

          const displayName = GetRoomTitleShort(uid == chatInfo.senderID ? chatInfo.receiverDisplayName : chatInfo.senderDisplayName)
          const photoURL = uid == chatInfo.senderID ? chatInfo.receiverPhotoURL : chatInfo.senderPhotoURL
          const lastMessageType = chatInfo.lastMessage['type']  

          const isText = checkMessageType(lastMessageType, constants.message.type.text) 
          const isEditedText = checkMessageType(lastMessageType, constants.message.type.edited)
          const isImage = checkMessageType(lastMessageType, constants.message.type.image)
          const isAudio = checkMessageType(lastMessageType, constants.message.type.audio)

          const lastMessage = GetMessageShort(Object.keys(chatInfo.lastMessage).length ? 
            (isText || isEditedText ? 
              chatInfo.lastMessage.text : (isImage ?
                constants.lastMessage.type.image : (isAudio ? 
                constants.lastMessage.type.audio : constants.lastMessage.type.deleted 
            ))) 
              : constants.lastMessage.type.first)

          const createdOrPublishedAt = Object.keys(chatInfo.lastMessage).length ? 
            GetPublishedDate(new Date(!chatInfo.lastMessage.createdAt['seconds'] ? 
              chatInfo.lastMessage.createdAt : chatInfo.lastMessage.createdAt['seconds'] * 1000)) 
              : 
            GetPublishedDate(new Date(!chatInfo.createdAt['seconds'] ? 
              chatInfo.createdAt : chatInfo.createdAt['seconds'] * 1000)) 

          return(
            <TouchableOpacity
              key={chatInfo.chatID}
              style={styles.containerChatRoomItem}
              onPress={redirectToPrivateChatRoom({props: {chatID: chatInfo.chatID, displayName, photoURL, chatInfo}})}
            >
              <Avatar.Image 
                size={60} 
                source={{ uri: photoURL }} 
              />
              <View style={{ marginStart: 10, ...styles.viewStyle }}>
                  <Text style={styles.nameStyle}>
                    {displayName}
                  </Text>
                  <View style={styles.viewStyle}>
                    <Text style={styles.lastMessageStyle}>
                      {lastMessage}
                    </Text>
                    <Text style={styles.publishedDateStyle}>
                      - {createdOrPublishedAt}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>)      
        })}
      </View>
    }
    
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      ref={scrollViewRef}>
        {privateConversationsList()}
    </ScrollView>
  )
}

function GroupChatList(props: any) {
  const dispatch = useDispatch()

  const groupChats = useSelector(selectGroupChats)
  const [groupConversations, setGroupConversations] = useState(groupChats)

  useEffect(() => {
    setRefreshing(true);
    setGroupConversations(groupChats)
    wait(2000).then(() => setRefreshing(false));
  }, [groupChats])

  const [refreshing, setRefreshing] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>()
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));  
  }, []);

  const { navigation } = props

  const redirectToGroupChatRoom = ({props}: any) => async () => {
    await dispatch(getMessagesFromGroupConversation(props.chatID))
    navigation.navigate('ChatRoom', {
      isPrivateChat: false,
      chatInfo: props.chatInfo,
      title: (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(0, 0, 0, 0)',
          }}>
          <Avatar.Image size={45} source={{ uri: props.photoURL }} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              marginBottom: 5,
              backgroundColor: 'rgba(0, 0, 0, 0)',
            }}>
            <Text style={styles.titleStyle}>
              {props.groupChatName}
            </Text>
          </View>
        </View>
      ),
    })
  }

  const groupConversationsList = () => 
  { 
    return Object.keys(groupConversations).length == 0 ? 
    (
      null
    ) : (
      <View style={{backgroundColor: 'rgba(0,0,0,0)'}}>
        {Object.keys(groupConversations).map((key) => {
          const chatInfo = { ...groupConversations[key], chatID: key }        

          const groupChatName = GetRoomTitleShort(chatInfo.name)
          const photoURL = chatInfo.photoURL
          const lastMessageType = chatInfo.lastMessage['type'] 

          const isText = checkMessageType(lastMessageType, constants.message.type.text) 
          const isEditedText = checkMessageType(lastMessageType, constants.message.type.edited)
          const isImage = checkMessageType(lastMessageType, constants.message.type.image)
          const isAudio = checkMessageType(lastMessageType, constants.message.type.audio)

          const lastMessage = GetMessageShort(Object.keys(chatInfo.lastMessage).length ? 
            (isText || isEditedText ? 
              chatInfo.lastMessage.text : (isImage ?
                constants.lastMessage.type.image : (isAudio ? 
                constants.lastMessage.type.audio : constants.lastMessage.type.deleted 
            ))) 
              : constants.lastMessage.type.first)

          const createdOrPublishedAt = Object.keys(chatInfo.lastMessage).length ? 
            GetPublishedDate(new Date(!chatInfo.lastMessage.createdAt['seconds'] ? 
              chatInfo.lastMessage.createdAt : chatInfo.lastMessage.createdAt['seconds'] * 1000))
            : 
            GetPublishedDate(new Date(!chatInfo.createdAt['seconds'] ? 
              chatInfo.createdAt : chatInfo.createdAt['seconds'] * 1000)) 

          return(
            <TouchableOpacity
              key={chatInfo.chatID}
              style={styles.containerChatRoomItem}
              onPress={redirectToGroupChatRoom({props: {chatID: chatInfo.chatID, groupChatName, photoURL, chatInfo}})}
            >
              <Avatar.Image 
                size={60} 
                source={{ uri: photoURL }} 
              />
              <View style={{ marginStart: 10, ...styles.viewStyle }}>
                  <Text style={styles.nameStyle}>
                    {groupChatName}
                  </Text>
                  <View style={styles.viewStyle}>
                    <Text style={styles.lastMessageStyle}>
                      {lastMessage}
                    </Text>
                    <Text style={styles.publishedDateStyle}>
                      - {createdOrPublishedAt}
                    </Text>
                  </View>
                </View>
            </TouchableOpacity>) 
        })} 
      </View>
    )
  }
  
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      ref={scrollViewRef}>
        {groupConversationsList()}
    </ScrollView>
  )
}

const Tab = createMaterialTopTabNavigator()

export default function ChatListStack(props: any) {
  const displayUser = useSelector(selectCurrentUser)
  const { uid } = displayUser

  const dispatch = useDispatch()
  const getConversations = async () => {
    await dispatch(getConversationFromID(uid))
    await dispatch(getGroupConversationFromID(uid))
  }
  
  useEffect(()=> {
    getConversations()
  }, [])
  
  return (
    <>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#194A4C',
          },
          indicatorStyle: {
            backgroundColor: '#194A4C',
          },
          showLabel: true,
          showIcon: true,
          tabStyle: {
            flexDirection: 'row',
          },
        }}>
        <Tab.Screen
          name="Privés"
          component={PrivateChatList}
          options={{
            title: 'Privés',
          }}
        />
        <Tab.Screen
          name="Groupes"
          component={GroupChatList}
          options={{ title: 'Groupes' }}
        />
      </Tab.Navigator>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerRightIcon: {
    padding: 10,
  },
  containerChatRoomItem: {
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    paddingStart: 10,
    paddingEnd: 5,
    paddingTop: 10,
    paddingBottom: 10,
    elevation: 4,
  },
  titleStyle: {
    marginStart: 15,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
  },
  nameStyle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessageStyle: {
    flex: 1,
    fontSize: 12,
  },
  publishedDateStyle: {
    flex: 1,
    color: 'grey',
    fontSize: 10,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)', // transparent background
  },
})
