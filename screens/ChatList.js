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
import { getConversation } from '../store/chatSlice'

export default function ChatList({ navigation }) {
  const displayUser = useSelector(selectCurrentUser)
  const { uid } = displayUser

  //const dispatch = useDispatch()
  //dispatch(getConversation('xDkv5ByD2CDZb5ixdzJy'))

  const privateChats = useSelector((state) => state.chat.privateConversations)

  let chats = []
  for (let i in privateChats) chats.push(privateChats[i])

  let chatInfo = chats.find(
    (c) =>
      (c.senderID = 'Yv4ZvUNErYhEc5l7uJ7ZzhiIyw32') &&
      (c.receiverID = 'MD3IFJBvLQbKkR3Z8g2BEGJ2Lht2')
  )

  chats = chats.filter((c) => (c.senderID = uid))

  return (
    <ScrollView>
      {chats.map((c, i) => {
        const chatInfo = chats.find(
          (ch) => (ch.senderID = c.senderID) && (ch.receiverID = c.receiverID)
        )

        const displayName = c.receiverDisplayName
        const photoURL = c.receiverPhotoURL
        const comment = chatInfo.messages.pop().text
        const createdAt = chatInfo.messages.pop().createdAt

        return (
          <TouchableOpacity
            key={i}
            style={styles.containerChatRoomItem}
            onPress={() =>
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
                        marginStart: 10,
                        flexDirection: 'column',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}>
                      <Text style={styles.titleStyle}>
                        {GetRoomTitleShort(displayName)}
                      </Text>
                    </View>
                  </View>
                ),
              })
            }>
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
      })}
    </ScrollView>
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
