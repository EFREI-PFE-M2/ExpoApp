import React from 'react'
import { View } from '../components/Themed'
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper'
import {
  GetMessageShort,
  GetRoomTitleShort,
  GetPublishedDate,
} from '../utils/ChatFunctions'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/userSlice'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import {
  selectPrivateChats,
  startMessagesListening,
  getMessagesFromPrivateConversation,
} from '../store/chatSlice'

function PrivateChatList({ navigation }) {
  const displayUser = useSelector(selectCurrentUser)
  const { uid } = displayUser

  const noPrivateChats = 'No private conversations.'

  let privateChats = useSelector(selectPrivateChats)

  let pChats = []

  for (let i in privateChats) {
    let privateChat = {
      ...privateChats[i],
      chatID: i,
    }
    pChats.push(privateChat)
  }

  const dispatch = useDispatch()

  return (
    <ScrollView>
      {pChats.length == 0 ? (
        <Text style={{ marginTop: 10, marginStart: 10, fontSize: 16 }}>
          {noPrivateChats}
        </Text>
      ) : (
        pChats.map((c, i) => {
          const chatInfo = c

          const displayName = c.receiverDisplayName
          const photoURL = c.receiverPhotoURL
          const comment = 'comment' //chatInfo.messages.pop().text
          const createdAt = new Date() //chatInfo.messages.pop().createdAt

          return (
            <TouchableOpacity
              key={i}
              style={styles.containerChatRoomItem}
              onPress={async () => {
                await dispatch(getMessagesFromPrivateConversation(c.chatID))
                navigation.navigate('ChatRoom', {
                  chatInfo,
                  title: (
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}>
                      <Avatar.Image size={45} source={{ uri: photoURL }} />
                      <View
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                          marginBottom: 5,
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                        }}>
                        <Text style={styles.titleStyle}>
                          {GetRoomTitleShort(displayName)}
                        </Text>
                      </View>
                    </View>
                  ),
                })
              }}>
              <Avatar.Image size={60} source={{ uri: photoURL }} />
              <View style={{ marginStart: 10, ...styles.viewStyle }}>
                <Text style={styles.nameStyle}>{displayName}</Text>
                <View style={styles.viewStyle}>
                  <Text style={styles.lastMessageStyle}>
                    {GetMessageShort(comment)}
                  </Text>
                  <Text style={styles.publishedDateStyle}>
                    - {GetPublishedDate(createdAt)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        })
      )}
    </ScrollView>
  )
}

function GroupChatList({ navigation }) {
  const noGroupChats = 'No group conversations.'
  return (
    <ScrollView>
      {[].length == 0 ? (
        <Text style={{ marginTop: 10, marginStart: 10, fontSize: 16 }}>
          {noGroupChats}
        </Text>
      ) : (
        <ScrollView></ScrollView>
      )}
    </ScrollView>
  )
}

const Tab = createMaterialTopTabNavigator()

export default function ChatListStack({ navigation }) {
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
