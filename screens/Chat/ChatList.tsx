import React, { useEffect, useState } from 'react'
import { View } from '../../components/Themed'
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper'
import {
  GetMessageShort,
  GetRoomTitleShort,
  GetPublishedDate,
} from '../../utils/ChatFunctions'
import { useDispatch, useSelector } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import {
  selectPrivateChats,
  getMessagesFromPrivateConversation,
  setReachFirstMessageState,
  selectGroupChats,
  getMessagesFromGroupConversation,
} from '../../store/chatSlice'
import { selectCurrentUser } from '../../store/userSlice'

function PrivateChatList(props: any) {
  const noPrivateChats = 'No private conversations.'

  const privateChats = useSelector(selectPrivateChats)
  const [privateConversations, setPrivateConversations] = useState(privateChats)

  const displayUser = useSelector(selectCurrentUser)
  const { uid } = displayUser

  useEffect(() => {
    setPrivateConversations(privateChats)
  })

  const dispatch = useDispatch()
  const { navigation } = props

  const redirectToPrivateChatRoom = (props: any) => () => 
  {
    dispatch(getMessagesFromPrivateConversation(props.key))
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

  return (
    <ScrollView>
      {Object.keys(privateConversations).length == 0 ? 
      (
        <Text style={{ marginTop: 10, marginStart: 10, fontSize: 16 }}>
          {noPrivateChats}
        </Text>
      ) : 
      <View style={{backgroundColor: 'rgba(0,0,0,0)'}}>
        {Object.keys(privateConversations).map((key) => {
          const chatInfo = { ...privateConversations[key], chatID: key }        

          const displayName = GetRoomTitleShort(uid == chatInfo.senderID ? chatInfo.receiverDisplayName : chatInfo.senderDisplayName)
          const photoURL = uid == chatInfo.senderID ? chatInfo.receiverPhotoURL : chatInfo.senderPhotoURL

          const lastMessage = GetMessageShort(Object.keys(chatInfo.lastMessage).length ? 
            (chatInfo.lastMessage['type'] == 'text' ? 
              chatInfo.lastMessage.text : (chatInfo.lastMessage['type'] == 'image' ?
                '[New image has been sent]' : '[New audio has been sent]')) 
              : '[Be the first to send message]')

          const createdOrPublishedAt = Object.keys(chatInfo.lastMessage).length ? 
            GetPublishedDate(new Date(!chatInfo.lastMessage.createdAt['seconds'] ? 
              chatInfo.lastMessage.createdAt : chatInfo.lastMessage.createdAt['seconds'] * 1000)) 
              : 
            GetPublishedDate(new Date(!chatInfo.createdAt['seconds'] ? 
              chatInfo.createdAt : chatInfo.createdAt['seconds'] * 1000)) 

          return(
            <TouchableOpacity
              key={key}
              style={styles.containerChatRoomItem}
              onPress={redirectToPrivateChatRoom({key, displayName, photoURL, chatInfo})}
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
    </ScrollView>
  )
}

function GroupChatList(props: any) {
  const noGroupChats = 'No group conversations.'

  let groupChats = useSelector(selectGroupChats)
  const [groupConversations, setGroupConversations] = useState(groupChats)

  useEffect(() => {
    setGroupConversations(groupChats)
  })

  const dispatch = useDispatch()
  const { navigation } = props

  const redirectToGroupChatRoom = (props: any) => () => {
    dispatch(getMessagesFromGroupConversation(props.key))
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

  return (
    <ScrollView>
      {Object.keys(groupConversations).length == 0 ? 
      (
        <Text style={{ marginTop: 10, marginStart: 10, fontSize: 16 }}>
          {noGroupChats}
        </Text>
      ) : (
        <View style={{backgroundColor: 'rgba(0,0,0,0)'}}>
          {Object.keys(groupConversations).map((key) => {
            const chatInfo = { ...groupConversations[key], chatID: key }        

            const groupChatName = GetRoomTitleShort(chatInfo.name)
            const photoURL = chatInfo.photoURL

            const lastMessage = GetMessageShort(Object.keys(chatInfo.lastMessage).length ? 
              (chatInfo.lastMessage['type'] == 'text' ? 
                chatInfo.lastMessage.text : (chatInfo.lastMessage['type'] == 'image' ?
                  '[New image has been sent]' : '[New audio has been sent]')) 
                : '[Be the first to send message]')

            const createdOrPublishedAt = Object.keys(chatInfo.lastMessage).length ? 
              GetPublishedDate(new Date(!chatInfo.lastMessage.createdAt['seconds'] ? 
                chatInfo.lastMessage.createdAt : chatInfo.lastMessage.createdAt['seconds'] * 1000))
              : 
              GetPublishedDate(new Date(!chatInfo.createdAt['seconds'] ? 
                chatInfo.createdAt : chatInfo.createdAt['seconds'] * 1000)) 

            return(
              <TouchableOpacity
                key={key}
                style={styles.containerChatRoomItem}
                onPress={redirectToGroupChatRoom({key, groupChatName, photoURL, chatInfo})}
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
    </ScrollView>
  )
}

const Tab = createMaterialTopTabNavigator()

export default function ChatListStack(props: any) {
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
