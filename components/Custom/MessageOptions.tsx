import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { Alert, Dimensions } from 'react-native'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import { Divider } from 'react-native-paper'
import { deleteMessageFromConversation } from '../../store/chatSlice'
import { useDispatch } from 'react-redux'

export default function MessageOptions({ props }: any) {

  const dispatch = useDispatch()

  const editMessage = (message: any) => async () => {
    alert('Edit message ' + message.messageID)
    closeMenu()
  }

  const deleteMessage = (message: any) => async () => {
    closeMenu()
    Alert.alert('Warning', 'Do you really want to erase your message?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await dispatch(deleteMessageFromConversation(chatID, message.messageID))
        },
      },
    ])
    
  }

  const replyMessage = (message: any) => async () => {
    alert('Reply to '+ message.displayName +': message ' + message.messageID)
    //console.log(chatInfo.chatID)
    //alert(chatInfo.chatID+" "+message.messageID)
    //await dispatch(deleteMessageFromConversation(chatInfo.chatID, message.messageID))
    closeMenu()
  }

  const downloadImage = (message: any) => async () => {
    alert('Download image from message ' + message.messageID)
    //console.log(chatInfo.chatID)
    //alert(chatInfo.chatID+" "+message.messageID)
    //await dispatch(deleteMessageFromConversation(chatInfo.chatID, message.messageID))
    closeMenu()
  }

  const {
    chatID,
    menuVisible,
    closeMenu,
    openMenu,
    m,
    i,
    currentItemForMenu,
    isCurrentUser,
  } = props

  const optionsStyles = {
    optionsContainer: {
      marginStart: isCurrentUser ? Dimensions.get('window').width - 150 : 30,
      width: 100,
    },
    optionWrapper: {
      margin: 5,
    },
    optionText: {
      color: 'black',
      fontSize: 12.5
    },
  }

  return (
    <Menu
      opened={menuVisible && i === currentItemForMenu}
      onBackdropPress={closeMenu}>
      <MenuTrigger>
        <MaterialIcons
          name="more-vert"
          style={
            isCurrentUser
              ? { marginStart: Dimensions.get('window').width - 57 }
              : { marginStart: 12 }
          }
          color={'#000'}
          size={24}
          onPress={() => openMenu(i)}
        />
      </MenuTrigger>
        { isCurrentUser ? 
          <MenuOptions customStyles={optionsStyles}>
            { m.type === 'text' ? 
            <MenuOption text="Editer" onSelect={editMessage(m)} /> : null }
            { m.type === 'image' ? 
            <MenuOption text="Télécharger" onSelect={downloadImage(m)} /> : null}
            <Divider />
            <MenuOption text="Supprimer" onSelect={deleteMessage(m)} />             
          </MenuOptions>
        :
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption text="Répondre" onSelect={replyMessage(m)} />
          <Divider />  
            { m.type === 'image' ? 
            <MenuOption text="Télécharger" onSelect={downloadImage(m)} /> : null} 
        </MenuOptions>
        }
      
    </Menu>
  )
}
