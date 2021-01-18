import { Platform, Text } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from './Themed';

export default function ImagePickerBtn({params}) {
     
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
    
        console.log(result);
    
        if (!result.cancelled) {
            const datetime = new Date()
            const message = {
                type: result.type,
                createdAt: datetime,
                displayName: params.username,
                photoURL: params.photoURL,
                uid: params.uid,
                text: '',
                audio: '',
                image: result.uri,
                imageCaption: result.uri.substring(result.uri.lastIndexOf('/') + 1, result.uri.length)
            }
            console.log(message)
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