import * as React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  MaterialIcons,
  MaterialCommunityIcons
} from '@expo/vector-icons'

function ChatFooter() {
  return (
    <View style={styles.containerChatFooter}>
      <View style={styles.chatFooterLeftPart}>
          <MaterialCommunityIcons name="image" size={30} onPress={() => {}}/>
          <MaterialCommunityIcons name="microphone" size={30} onPress={() => {}}/>
      </View>
      
      <View style={styles.chatFooterMiddlePart}>
        <TextInput style={styles.chatTextInput}
      /*onChangeText={text => onChangeText(text)}*/ placeholder="Envoyer un message..."
      multiline numberOfLines={2} />
      </View>
      
      <View style={styles.chatFooterRightPart}>
      <MaterialIcons name="send" size={30} onPress={() => {}}/>
      </View>   
    </View>
  )
}

export default ChatFooter

const styles = StyleSheet.create({
    containerChatFooter: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      paddingStart: 10,
      paddingTop: 10,
      paddingBottom: 5
    },
    chatFooterLeftPart: {
      flex: 2, 
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginEnd: 10
    },
    chatFooterMiddlePart: {
      flex: 8
    },
    chatFooterRightPart: {
      marginStart: 10,
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