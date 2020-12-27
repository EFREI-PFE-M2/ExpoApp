import React from 'react'
import { View } from '../components/Themed'
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper'
import {
  GetMessageShort,
  GetRoomTitleShort,
  GetPublishedDate,
} from '../utils/ChatFunctions'
import { users } from '../store/testChatStore'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/userSlice'
import { getConversation } from '../store/chatSlice'

export default function ChatList({ navigation }) {
  const displayUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  dispatch(getConversation('xDkv5ByD2CDZb5ixdzJy'))
  const { photoURL, username } = displayUser

  return (
    <ScrollView>
      {users.map((u, i) => {
        return (
          <TouchableOpacity
            key={i}
            style={styles.containerChatRoomItem}
            onPress={() =>
              navigation.navigate('ChatRoom', {
                from: username,
                fromPicture: photoURL,
                to: u.username,
                toPicture: u.photoURL,
                title: (
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                    }}>
                    <Avatar.Image size={45} source={{ uri: u.photoURL }} />
                    <View
                      style={{
                        marginStart: 10,
                        flexDirection: 'column',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}>
                      <Text style={styles.titleStyle}>
                        {GetRoomTitleShort(u.username)}
                      </Text>
                    </View>
                  </View>
                ),
              })
            }>
            <Avatar.Image size={40} source={{ uri: u.photoURL }} />
            <View style={{ marginStart: 10, ...styles.viewStyle }}>
              <Text style={styles.nameStyle}>{u.username}</Text>
              <View style={styles.viewStyle}>
                <Text style={styles.lastMessageStyle}>
                  {GetMessageShort(u.comment)}
                </Text>
                <Text style={styles.publishedDateStyle}>
                  - {GetPublishedDate(u.datetime)}
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
    fontSize: 12,
  },
  lastMessageStyle: {
    flex: 1,
    fontSize: 10,
  },
  publishedDateStyle: {
    flex: 1,
    color: 'grey',
    fontSize: 8,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)', // transparent background
  },
})
