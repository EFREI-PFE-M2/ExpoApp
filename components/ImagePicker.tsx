import { Platform, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from './Themed';
import { sendGroupChatMessage, sendPrivateChatMessage } from '../store/chatSlice';
import { useDispatch } from 'react-redux';
import uploadImage from '../utils/uploadImage';

export default function ImagePickerBtn({props}: any) {
    const dispatch = useDispatch()
    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
              return
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.cancelled) {
            const { displayName, photoURL, uid, chatID, isPrivateChat, chatHistory, setChatHistory } = props

            const datetime = new Date()
            const message = {
                type: result.type,
                createdAt: datetime,
                displayName: displayName,
                photoURL: photoURL,
                uid: uid,
                image: {
                    uri: result.uri,
                    name: result.uri.substring(result.uri.lastIndexOf('/') + 1, result.uri.length),
                    height: result.height,
                    width: result.width
                }
            }
            setChatHistory([...chatHistory, message])
            const path = isPrivateChat ? `chats/private/${chatID}` : `chats/group/${chatID}`
            message.image.uri = await uploadImage(message.image.uri, message.image.name, path)
            await dispatch(isPrivateChat ? sendPrivateChatMessage(chatID, message) : 
            sendGroupChatMessage(chatID, message))
        }
    };  

    return (<View>
        <MaterialCommunityIcons
            name="image"
            size={30}
            onPress={pickImage}
        />
    </View>
    )
}