import React, { useState } from 'react'
import { StyleSheet, ScrollView, TextInput } from 'react-native'
import { Text, View } from '../components/Themed'
import { chatHistory } from '../store/testChatStore'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/userSlice'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { GetPublishedDate } from '../utils/ChatFunctions'
import { Avatar } from 'react-native-paper'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import {
  selectMessages,
  sendTextMessage,
  startMessagesListening,
} from '../store/chatSlice'

function showExtraInfo(check, sameItem) {
  if (!(check && sameItem)) {
    return 'none'
  } else {
    return undefined
  }
}

export default function ChatRoom({ route }) {
  const [showState, setShowState] = useState(false)
  const [currentItem, setCurrentItem] = useState(0)
  const displayUser = useSelector(selectCurrentUser)
  const { username, photoURL, uid } = displayUser

  const { chatInfo } = route.params

  const messages = useSelector(
    (state) => state.chat.privateConversations[chatInfo.chatID]?.messages
  )
  const msgs = useSelector(selectMessages)
  const dispatch = useDispatch()

  let messagesArray = []
  for (let i in messages) {
    messagesArray.push(messages[i])
  }

  const [chatHistory, setChatHistory] = useState(msgs)
  const [content, setContent] = useState('')

  const sendMessage = () => {
    const datetime = new Date()

    if (content.trim() != '') {
      const message = {
        type: 'text',
        createdAt: datetime,
        displayName: username,
        photoURL,
        uid,
        text: content.trim(),
        audio: '',
        image: '',
        imageCaption: '',
      }

      setContent('')

      setChatHistory([...chatHistory, message])
      dispatch(sendTextMessage(chatInfo.chatID, message))
    }
  }

  function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
  }

  function isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    return contentOffset.y == 0
  }

  return (
    <View style={styles.container}>
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToTop(nativeEvent)) {
            console.log('top')
          }
          if (isCloseToBottom(nativeEvent)) {
            console.log('bottom')
          }
        }}
        ref={(ref) => {
          this.scrollView = ref
        }}
        onContentSizeChange={() =>
          this.scrollView.scrollToEnd({ animated: true })
        }>
        {chatHistory.map((m, i) => {
          const dt = new Date(m.createdAt['seconds'] * 1000)
          if (m.uid == chatInfo.senderID) {
            return (
              <View style={{ backgroundColor: 'rgba(0,0,0,0)', padding: 10 }}>
                <Text
                  style={{
                    display: showExtraInfo(showState, i == currentItem),
                    ...styles.publishedDateStyle,
                  }}>
                  {GetPublishedDate(dt)}
                </Text>
                <Text
                  style={{
                    paddingRight: 60,
                    paddingTop: 15,
                    alignSelf: 'flex-end',
                  }}>
                  {m.displayName}
                </Text>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <TouchableOpacity
                    style={styles.containerMessageRight}
                    onPress={() => {
                      setShowState(!showState)
                      setCurrentItem(i)
                    }}>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
                      <Text style={{ color: '#fff' }}>{m.text}</Text>
                    </View>
                  </TouchableOpacity>
                  <Avatar.Image
                    size={48}
                    style={{ marginStart: 10 }}
                    source={{ uri: m.photoURL }}
                  />
                </View>
              </View>
            )
          } else {
            return (
              <View style={{ backgroundColor: 'rgba(0,0,0,0)', padding: 10 }}>
                <Text
                  style={{
                    display: showExtraInfo(showState, i == currentItem),
                    ...styles.publishedDateStyle,
                  }}>
                  {GetPublishedDate(dt)}
                </Text>
                <Text style={{ paddingLeft: 60, paddingTop: 15 }}>
                  {m.displayName}
                </Text>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    flexDirection: 'row',
                  }}>
                  <Avatar.Image
                    size={48}
                    style={{ marginEnd: 10 }}
                    source={{ uri: m.photoURL }}
                  />
                  <TouchableOpacity
                    key={i}
                    style={styles.containerMessageLeft}
                    onPress={() => {
                      setShowState(!showState)
                      setCurrentItem(i)
                    }}>
                    <Text>{m.text}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        })}
      </ScrollView>

      <View style={styles.containerChatFooter}>
        <View style={styles.chatFooterLeftPart}>
          <MaterialCommunityIcons
            name="image"
            size={30}
            onPress={() => alert('Include image picker')}
          />
          <MaterialCommunityIcons
            name="microphone"
            size={30}
            onPress={() => alert('Include voice message')}
          />
        </View>

        <View style={styles.chatFooterMiddlePart}>
          <TextInput
            style={styles.chatTextInput}
            value={content}
            onChangeText={(text) => setContent(text)}
            placeholder="Envoyer un message..."
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.chatFooterRightPart}>
          <MaterialIcons name="send" size={30} onPress={sendMessage} />
        </View>
      </View>
    </View>
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
  containerMessageRight: {
    backgroundColor: '#194A4C',
    padding: 15,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    marginBottom: 15,
    marginStart: 200,
  },
  containerMessageLeft: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    marginBottom: 15,
    marginEnd: 200,
  },
  publishedDateStyle: {
    fontSize: 11,
    alignSelf: 'center',
  },
  containerChatFooter: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingStart: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
  chatFooterLeftPart: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginEnd: 10,
  },
  chatFooterMiddlePart: {
    flex: 4,
    marginEnd: 10,
  },
  chatFooterRightPart: {
    marginEnd: 10,
  },
  chatTextInput: {
    height: 30,
    fontSize: 11,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    opacity: 0.6,
    paddingBottom: 5,
  },
})
