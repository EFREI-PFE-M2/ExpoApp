import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View } from "./Themed";


export default function AudioRecorder({props}: any) {
    const pressOnMicro = () => alert('audio recording')

    return (
        <View>
            <MaterialCommunityIcons
            name="microphone"
            style={{marginStart: 5}}
            size={30}
            onPress={pressOnMicro}
          />
        </View>
    )
}