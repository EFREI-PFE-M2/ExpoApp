import React from 'react'
import { View } from '../components/Themed'
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper'
import {
  GetMessageShort,
  GetRoomTitleShort,
  GetPublishedDate,
} from '../functions/ChatFunctions'
import { users } from '../store/testChatStore'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/userSlice'

export default function ChatList({ navigation }) {
  const displayUser = useSelector(selectCurrentUser)
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
                to: u.name,
                toPicture: u.avatar,
                title: (
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                    }}>
                    <Avatar.Image size={45} source={{ uri: u.avatar }} />
                    <View
                      style={{
                        marginStart: 10,
                        flexDirection: 'column',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}>
                      <Text style={styles.titleStyle}>
                        {GetRoomTitleShort(u.name)}
                      </Text>
                    </View>
                  </View>
                ),
              })
            }>
            <Avatar.Image size={40} source={{ uri: u.avatar }} />
            <View style={{ marginStart: 10, ...styles.viewStyle }}>
              <Text style={styles.nameStyle}>{u.name}</Text>
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
