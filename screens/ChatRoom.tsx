import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, TextInput, Image, RefreshControl } from 'react-native'
import { Text, View } from '../components/Themed'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../store/userSlice'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { GetPublishedDate } from '../utils/ChatFunctions'
import { Avatar } from 'react-native-paper'
import ImagePicker from '../components/ImagePicker'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import {
  getMessagesFromPrivateConversation,
  selectMessages,
  sendChatMessage,
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

  const messages = useSelector(selectMessages)
  const dispatch = useDispatch()

  const [chatHistory, setChatHistory] = useState(messages)
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
        text: content.trim()
      }

      setContent('')

      setChatHistory([...chatHistory, message])
      dispatch(sendChatMessage(chatInfo.chatID, message))
    }
  }

  useEffect(() => {
    setChatHistory(messages)
  })

  /*
  function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
  }

  function isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    return contentOffset.y == 0
  }*/

  const [refreshing, setRefreshing] = React.useState(false);

  const wait = (timeout: number) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    //console.log('ok')
    const earliestMessageID = chatHistory[0].messageID
    dispatch(getMessagesFromPrivateConversation(
      chatInfo.chatID,
      earliestMessageID
    ))
    //setChatHistory(messages)

    wait(2000).then(() => setRefreshing(false));
  }, []);

  const scrollViewRef = React.createRef<ScrollView>()

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        /*onScroll={({ nativeEvent }) => {
          if (isCloseToTop(nativeEvent)) {
            
          }
          if (isCloseToBottom(nativeEvent)) {
            //console.log('bottom')
          }
        }}*/
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }>
        {chatHistory.map((m: any, i: number) => {
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
                    { m.type == 'text' ? <Text style={{ color: '#fff' }}>{m.text}</Text> :
                      (m.type == 'image' ? <Image source={{ uri: m.image.uri }} style={{ width: 200, height: 200 }}/> : 
                      <Text>audio part</Text>
                      )} 
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
                    { m.type == 'text' ? <Text>{m.text}</Text> :
                      (m.type == 'image' ? <Image source={{ uri: m.image.uri }} style={{ width: 200, height: 200 }}/> : 
                      <Text>audio part</Text>
                      )}                    
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        })}
      </ScrollView>

      <View style={styles.containerChatFooter}>
        <View style={styles.chatFooterLeftPart}>
        <ImagePicker params={{uid, username, photoURL, chatID: chatInfo.chatID}} />
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
