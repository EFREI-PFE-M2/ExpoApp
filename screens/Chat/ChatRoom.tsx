import React, { useEffect, useState } from 'react'
import { Animated, StyleSheet, ScrollView, TextInput, Image, RefreshControl, Dimensions } from 'react-native'
import { Text, View } from '../../components/Themed'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/userSlice'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { GetPublishedDate } from '../../utils/ChatFunctions'
import { Avatar, Divider } from 'react-native-paper'
import ImagePicker from '../../components/ImagePicker'
import { MaterialIcons } from '@expo/vector-icons'
import {
  deleteMessageFromConversation,
  getMessagesFromGroupConversation,
  getMessagesFromPrivateConversation,
  selectGroupChats,
  selectPrivateChats,
  sendGroupChatMessage,
  sendPrivateChatMessage,
} from '../../store/chatSlice'
import AudioRecorder from '../../components/AudioRecorder'
import  { MenuProvider } from 'react-native-popup-menu';
import MessageOptions from '../../components/Custom/MessageOptions'

export default function ChatRoom(props: any) {
  const [dateVisible, setTimeVisible] = useState(false)
  const [currentItemForDate, setCurrentItemForDate] = useState(0)

  const showDate = (i: any) => () => {
    closeMenu()
    if (i === currentItemForDate)
      setTimeVisible(!dateVisible)
    else
      setTimeVisible(true)
    setCurrentItemForDate(i)
  }

  const [menuVisible, setMenuVisible] = useState(false);
  const [currentItemForMenu, setCurrentItemForMenu] = useState(0)

  const openMenu = (i:any) => {setMenuVisible(true); setCurrentItemForMenu(i)};
  const closeMenu = () => setMenuVisible(false);

  const displayUser = useSelector(selectCurrentUser)
  const { displayName, photoURL, uid } = displayUser
  console.log(displayUser)

  const { chatInfo, isPrivateChat } = props.route.params
 
  const messages = isPrivateChat ? useSelector(selectPrivateChats)[chatInfo.chatID]?.messages
  : useSelector(selectGroupChats)[chatInfo.chatID]?.messages

  const [chatHistory, setChatHistory] = useState(messages)
  
  const dispatch = useDispatch()
  
  const [content, setContent] = useState('')
  const changeText = (text: string) => setContent(text)

  const sendMessage = async () => {
    const datetime = new Date()

    if (content.trim() != '') {
      const message = {
        type: 'text',
        createdAt: datetime,
        displayName,
        photoURL,
        uid,
        text: content.trim()
      }

      setContent('')

      await dispatch(isPrivateChat ? 
        sendPrivateChatMessage(chatInfo.chatID, message) 
        : 
        sendGroupChatMessage(chatInfo.chatID, message)
      ) 
    }
  }

  function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }: any) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
  }

  function isCloseToTop({ layoutMeasurement, contentOffset, contentSize }: any) {
    return contentOffset.y == 0
  }

  const onScroll = ({ nativeEvent }: any) => {
    if (isCloseToTop(nativeEvent)) {
      fadeIn()
    } else {
      fadeOut()
    }
  }

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    setChatHistory(messages ? messages : [])    
  })

  const reachFirstMessageState = isPrivateChat ? useSelector(selectPrivateChats)[chatInfo.chatID]?.reachFirstMessageState
  : useSelector(selectGroupChats)[chatInfo.chatID]?.reachFirstMessageState

  const fadeAnimation = React.useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnimation value to 1 in 500 ms
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnimation value to 0 in 500 ms
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const wait = (timeout: number) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = React.useCallback(() => {
      setRefreshing(true);

      const earliestMessageID = chatHistory[0].messageID
      dispatch(isPrivateChat ? getMessagesFromPrivateConversation(
        chatInfo.chatID,
        earliestMessageID
      ) : getMessagesFromGroupConversation(
        chatInfo.chatID,
        earliestMessageID
      ))

      wait(2000).then(() => setRefreshing(false));  
  }, []);

  const clickToRefresh = () => { return reachFirstMessageState ? null : onRefresh() }

  const scrollViewRef = React.createRef<ScrollView>()
  let scrollToTopMessage = reachFirstMessageState ? 
    'You already reached the top of the messages' : 'Click or scroll up to display older messages'

  const contentSizeChange = () => scrollViewRef.current?.scrollToEnd({ animated: true })

  const senderMessageTemplate = ({m, i, isCurrentUser}: any) => <View style={styles.subViewRightStyle}>
  <TouchableOpacity
    style={styles.containerMessageRight}
    //onLongPress={openMenu}
    onPress={showDate(i)}
    >
      {showContent(m, isCurrentUser)} 
    </TouchableOpacity>
     <Avatar.Image
        size={48}
        style={styles.senderProfilePhotoStyle}
        source={{ uri: m.photoURL }}
    /> 
    </View> 

  const receiverMessageTemplate = ({m, i, isCurrentUser}: any) => <View style={styles.subViewLeftStyle}>
    <Avatar.Image
      size={48}
      style={styles.receiverProfilePhotoStyle}
      source={{ uri: m.photoURL }}
    /> 
    <TouchableOpacity
      style={styles.containerMessageLeft}
      //onLongPress={openMenu}
      onPress={showDate(i)}
      >
        {showContent(m, isCurrentUser)}
    </TouchableOpacity>
  </View> 

  
const showContent = (message: any, currentUser: any) => {
  return message.type === 'text' ? 
  <Text style={{ color: currentUser ? '#fff' : '#000' }}>
    {message.text}
    </Text> 
    :
    (message.type === 'image' ? 
    <Image 
      source={{ uri: message.image.uri }} 
      style={styles.imageStyle}
    /> 
        : 
        (message.type === 'audio' ?
          <Text>audio part</Text>
          :
          <Text style={{ fontStyle: 'italic', color: currentUser ? '#fff' : '#000' }}>
            Ce message a été supprimé
          </Text>
        )
    )
}
  
return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        onScroll={onScroll}
        ref={scrollViewRef}
        onContentSizeChange={contentSizeChange}>
      
        <Animated.View
          style={[
            styles.containerScrollToTopMessage,
            {
              opacity: fadeAnimation // Bind opacity to animated value
            }
          ]}
        >
          <TouchableOpacity onPress={clickToRefresh}>
            <Text style={styles.scrollToTopMessageStyle}>{scrollToTopMessage}</Text>
          </TouchableOpacity>
        </Animated.View> 
        
        {chatHistory.map((m: any, i: number) => {
          const dt = !m.createdAt['seconds'] ? m.createdAt : new Date(m.createdAt['seconds'] * 1000)
          const isCurrentUser = m.uid === uid
                 
          return (
            <MenuProvider skipInstanceCheck={true}>
              <View style={styles.viewStyle}>
                <Text
                  style={{
                    display: dateVisible && i === currentItemForDate ? undefined : 'none',
                    ...styles.publishedDateStyle,
                  }}>
                  {GetPublishedDate(dt)}
                </Text>
                <Text
                  style={isCurrentUser ? styles.senderDisplayNameStyle : styles.receiverDisplayNameStyle}>
                  {m.displayName}
                </Text>
                { isCurrentUser ?
                  senderMessageTemplate({m,i,isCurrentUser})
                  : 
                  receiverMessageTemplate({m,i,isCurrentUser})
                } 

          { m.type != 'deleted' 
          ?
            <MessageOptions props={{
              chatID: chatInfo.chatID,
              menuVisible,
              closeMenu,
              openMenu,
              m,
              i,
              currentItemForMenu,
              isCurrentUser,
              isPrivateChat
            }}/>    
          :
            null
          }    
                     
          </View>
        </MenuProvider>
        )
      })}
        
      </ScrollView>

      <View style={styles.containerChatFooter}>
        <View style={styles.chatFooterLeftPart}>
          <ImagePicker props={{isPrivateChat, uid, displayName, photoURL, 
            chatID: chatInfo.chatID, chatHistory, setChatHistory
          }}/>
          <AudioRecorder props={{isPrivateChat, uid, displayName, photoURL, 
            chatID: chatInfo.chatID, chatHistory, setChatHistory
          }}/>
        </View>

        <View style={styles.chatFooterMiddlePart}>
          <TextInput
            style={styles.chatTextInput}
            value={content}
            onChangeText={changeText}
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
  subViewLeftStyle: {
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'row',
  },
  subViewRightStyle: {
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  scrollToTopMessageStyle: {
    fontSize: 12
  },
  viewStyle: { 
    backgroundColor: 'rgba(0,0,0,0)', 
    padding: 10 
  },
  senderDisplayNameStyle: {
    paddingRight: 60,
    paddingTop: 15,
    alignSelf: 'flex-end',
  },
  receiverDisplayNameStyle: {
    paddingLeft: 60,
    paddingTop: 15,
  },
  senderProfilePhotoStyle: {
    marginStart: 10
  },
  receiverProfilePhotoStyle: {
    marginEnd: 10
  },
  imageStyle: {
    width: 200, 
    height: 200 
  },
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
  containerScrollToTopMessage: {
    backgroundColor: '#fff',
    alignItems: 'center',
    marginStart: 50,
    marginTop: 10,
    marginEnd: 50,
    padding: 15,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
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