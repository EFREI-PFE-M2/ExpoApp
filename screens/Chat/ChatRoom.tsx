import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Animated, StyleSheet, ScrollView, TextInput, Image, RefreshControl, Dimensions } from 'react-native'
import { Text, View } from '../../components/Themed'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/userSlice'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { checkMessageType, fadeIn, fadeOut, GetPublishedDate, wait } from '../../utils/ChatFunctions'
import { Avatar, Divider } from 'react-native-paper'
import ImagePicker from '../../components/ImagePicker'
import { MaterialIcons } from '@expo/vector-icons'
import {
  editMessageFromConversation,
  getMessagesFromGroupConversation,
  getMessagesFromPrivateConversation,
  isMessagesCollectionUpdated,
  selectGroupChats,
  selectPrivateChats,
  sendGroupChatMessage,
  sendPrivateChatMessage,
} from '../../store/chatSlice'
import AudioRecorder from '../../components/AudioRecorder'
import  { MenuProvider } from 'react-native-popup-menu';
import MessageOptions from '../../components/Custom/MessageOptions'
import useMessages from '../../hooks/useMessages'
import constants from '../../constants/ChatConstants'

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

  const { chatInfo, isPrivateChat } = props.route.params

  const messages = useMessages({isPrivateChat, chatID: chatInfo.chatID})

  const [chatHistory, setChatHistory] = useState(messages)

  const dispatch = useDispatch()
  
  const [content, setContent] = useState('')
  const changeText = (text: string) => setContent(text)

  const sendMessage = async () => {
    if (content.trim() != '') {    
      setContent('')
      setRefreshing(true)

      const message = {
        type: 'text',
        createdAt: new Date(),
        displayName,
        photoURL,
        uid,
        text: content.trim()
      }

      await dispatch(isPrivateChat ? 
        sendPrivateChatMessage(chatInfo.chatID, message) 
        : 
        sendGroupChatMessage(chatInfo.chatID, message)
      )
      
      wait(500).then(() => {
        setRefreshing(false)
        contentSizeChange()
      });
    }
  }  
  
  useEffect(() => {
    setRefreshing(true);
    if (messages)
      setChatHistory(messages)
    wait(2000).then(() => {  
      setRefreshing(false);});
    //isMessagesCollectionUpdated({isPrivate: isPrivateChat, chatID: chatInfo.chatID}).then(async (res: any) => console.log(await res)); 
    /*console.log(messages.filter((m1: any) => !chatHistory.some((m2: any) => m1.messageID === m2.messageID && m1.type === m2.type)))
    if (messages.filter((m1: any) => !chatHistory.some((m2: any) => m1.messageID === m2.messageID && m1.type === m2.type)).length != 0)
      isMessagesCollectionUpdated({isPrivate: isPrivateChat, chatID: chatInfo.chatID, earliestMessageID: messages[0].messageID})
     
    .catch((err)=> console.log('Error:'+err))*/
  }, [messages])
  
  function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }: any) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
  }

  function isCloseToTop({ layoutMeasurement, contentOffset, contentSize }: any) {
    return contentOffset.y == 0
  }

  const onScroll = ({ nativeEvent }: any) => {
    if (isCloseToTop(nativeEvent)) {
      fadeIn(fadeAnimation)
    } else {
      fadeOut(fadeAnimation)
    }
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const reachFirstMessageState = isPrivateChat ? useSelector(selectPrivateChats)[chatInfo.chatID]?.reachFirstMessageState
  : useSelector(selectGroupChats)[chatInfo.chatID]?.reachFirstMessageState

  const fadeAnimation = React.useRef(new Animated.Value(0)).current;

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

  const scrollViewRef = React.useRef<ScrollView>()

  let scrollToTopMessage = reachFirstMessageState ? 
  constants.topMessage.type.first : constants.topMessage.type.scrollUp

  const [scrollOnce, setScrollOnce] = useState(0)

  const contentSizeChange = () => { 
    if (scrollOnce == 0) 
      scrollViewRef.current?.scrollToEnd({ animated: true });
    setScrollOnce(scrollOnce+1);
  }

  const senderMessageTemplate = ({m, i, isCurrentUser}: any) => <View style={styles.subViewRightStyle}>
    <TouchableOpacity
      style={styles.containerMessageRight}
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
      onPress={showDate(i)}
      >
        {showContent(m, isCurrentUser)}
    </TouchableOpacity>
  </View> 

  const [messageToEdit, setMessageToEdit] = useState('')
  const [editedContent, setEditedContent] = useState('')
  const changeOldText = (text: string) => setEditedContent(text)
  
  const showContent = (message: any, currentUser: any) => {
    const isText = checkMessageType(message.type, constants.message.type.text) 
    const isEditedText = checkMessageType(message.type, constants.message.type.edited)
    const isImage = checkMessageType(message.type, constants.message.type.image)
    const isAudio = checkMessageType(message.type, constants.message.type.audio) 

    return isText || isEditedText ? 
    messageToEdit != message.messageID ?
    <Text style={{ fontStyle: isEditedText ? 'italic' : 'normal', color: currentUser ? '#fff' : '#000' }}>
      {message.text}
    </Text> :
    <TextInput
      style={{ height: 20, width: 100, color: '#fff' }}
      onChangeText={changeOldText}
      value={editedContent}
    />
      :
      (isImage ? 
      <Image 
        source={{ uri: message.image.uri }} 
        style={styles.imageStyle}
      /> 
          : 
          (isAudio ?
            <Text>audio part</Text>
            :
            <Text style={{ fontStyle: 'italic', opacity: 0.7, color: currentUser ? '#fff' : '#000' }}>
              {constants.message.deleted.text}
            </Text>
          )
      )
  }

  const confirmEdit = (message: any) => async () => {
    setRefreshing(true)
    await dispatch(editMessageFromConversation(chatInfo.chatID, message.messageID, editedContent, isPrivateChat))
    setMessageToEdit('')
    wait(500).then(() => {
      setEditedContent('')
      setRefreshing(false)
    });
    
  }

  const revertBack = () => {
    setMessageToEdit('')
    setEditedContent('')
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

          { m.type != constants.message.type.deleted 
          ? messageToEdit != m.messageID ?
            <MessageOptions props={{
              chatID: chatInfo.chatID,
              menuVisible,
              closeMenu,
              openMenu,
              setRefreshing,
              setMessageToEdit,
              setEditedContent,
              m,
              i,
              currentItemForMenu,
              isCurrentUser,
              isPrivateChat
            }}/> 
            :
            <View style={{flexDirection: 'row', backgroundColor:'rgba(0,0,0,0)'}}>
              <MaterialIcons
                name="check-circle"
                style={{
                  marginStart: Dimensions.get('window').width - 145
                }}
                color={'#217338'}
                size={36}
                onPress={confirmEdit(m)}
              />   
              <MaterialIcons
                name="cancel"
                color={'#c9342e'}
                size={36}
                onPress={revertBack}
              /> 
            </View>
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