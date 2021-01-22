import { Platform, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from './Themed';
import { sendChatMessage } from '../store/chatSlice';
import { useDispatch } from 'react-redux';

export default function ImagePickerBtn(props) {
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
            const datetime = new Date()
            const message = {
                type: result.type,
                createdAt: datetime,
                displayName: props.params.username,
                photoURL: props.params.photoURL,
                uid: props.params.uid,
                image: {
                    uri: result.uri,
                    name: result.uri.substring(result.uri.lastIndexOf('/') + 1, result.uri.length),
                    height: result.height,
                    width: result.width
                }
            }
            await dispatch(sendChatMessage(props.params.chatID, message))
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