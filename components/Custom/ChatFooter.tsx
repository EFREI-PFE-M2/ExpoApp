import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { GetPublishedDate } from '../../functions/ChatFunctions'
import {
  MaterialIcons,
  MaterialCommunityIcons
} from '@expo/vector-icons'

export default function ChatFooter(props) {
  const {from, to, chatHistory, updateChatHistory} = props
  const [content, setContent] = useState('')

  const sendMessage = () => {
    const chat = chatHistory.find(
      (item) =>
        (item.owners[0] == from && item.owners[1] == to) ||
        (item.owners[1] == from && item.owners[0] == to)
    )

    const datetime = new Date()
  
    if (content.trim() != '') {
      const message = {
        from,
        to,
        content: content.trim(),
        datetime
      }


      chat.messages.push(message)
      setContent('')
      updateChatHistory(chatHistory)
    }
  }

  return (
    <View style={styles.containerChatFooter}>
      <View style={styles.chatFooterLeftPart}>
          <MaterialCommunityIcons name="image" size={30} onPress={() => alert('Include image picker')}/>
          <MaterialCommunityIcons name="microphone" size={30} onPress={() => alert('Include voice message')}/>
      </View>
      
      <View style={styles.chatFooterMiddlePart}>
        <TextInput style={styles.chatTextInput} value={content}
      onChangeText={(text) => setContent(text)} placeholder="Envoyer un message..."
      multiline numberOfLines={2} />
      </View>
      
      <View style={styles.chatFooterRightPart}>
      <MaterialIcons name="send" size={30} onPress={sendMessage}/>
      </View>   
    </View>
  )
}

const styles = StyleSheet.create({
    containerChatFooter: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      paddingStart: 10,
      paddingTop: 10,
      paddingBottom: 5
    },
    chatFooterLeftPart: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginEnd: 10
    },
    chatFooterMiddlePart: {
      flex: 1,
      marginEnd: 10
    },
    chatFooterRightPart: {
      marginEnd: 10
    },
    chatTextInput: 
    {
      height: 30,
      fontSize: 11, 
      borderBottomColor: 'grey',
      borderBottomWidth: 1, 
      opacity: 0.6, 
      paddingBottom: 5
    },
  })