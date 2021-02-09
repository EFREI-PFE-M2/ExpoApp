import { Avatar} from 'react-native-paper'
import React, {useRef, useEffect} from 'react'

export default function ProfileAvatar(props){
    let {url} = props
    return (
        <>
        {
            url ? (<Avatar.Image source={{  uri: url  }} size={48}/>) 
            :
            (<Avatar.Image source={require('../assets/images/avatar.png')} size={48}/>)
        }
        </>
    )
}