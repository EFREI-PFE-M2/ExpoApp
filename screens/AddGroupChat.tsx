import React, { useEffect } from 'react'
import { StyleSheet, Text } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { View } from "../components/Themed";
import { changeGroupChatInfo, selectUsersToAdd } from '../store/chatSlice';

export default function AddGroupChat() {
    const aUsers = useSelector(selectUsersToAdd)
    const [groupChatPhotoURL, setGroupChatPhotoURL] = React.useState('https://m.info.pmu.fr/images/pmu.jpg')
    const [groupChatName, setGroupChatName] = React.useState('')
    
    const nameOnChange = (name: string) => { setGroupChatName(name); dispatch(changeGroupChatInfo(groupChatInfo)) }
    
    const groupChatInfo = {
        name: groupChatName, 
        photoURL: groupChatPhotoURL, 
        users: aUsers
    }

    const dispatch = useDispatch()
    dispatch(changeGroupChatInfo(groupChatInfo))

    return(<View style={styles.container}>
        <Text style={styles.titleStyle}>Photo de groupe</Text>
        <Avatar.Image size={140} style={styles.photoStyle}
          source={{uri: groupChatPhotoURL}}
        />
        <Text style={styles.titleStyle}>Nom de groupe</Text>
        <TextInput
          value={groupChatName}
          onChangeText={nameOnChange}
          mode="outlined"
          placeholder="e.g. PMU's Dev Team"
          placeholderTextColor="#757575"
          style={{ width: '100%', paddingHorizontal: 25}}
          theme={{
            colors: {
              background: '#0002',
              text: '#000',
            },
          }}
        />        
        <Text style={styles.titleStyle}>Utilisateurs invités</Text>
        <ScrollView>
            {Object.values(aUsers).map((u: any) => { 
                return(
                <TouchableOpacity
                    key={u.uid}
                    style={styles.containerProfile}
                >
                    <Avatar.Image size={60} source={{ uri: u.photoURL }} />
                    <View style={styles.containerView}>
                        <Text style={{marginTop: 8}}>{u.username}</Text>
                    </View>
                </TouchableOpacity>
            )})}
          </ScrollView>
    </View>)
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    titleStyle: {
        marginLeft: 30, marginTop: 20, fontSize: 18
    },
    photoStyle: {
        marginLeft: 30, marginTop: 20 
    },
    containerView: {
        flexDirection: 'row',
        marginStart: 10,
        marginTop: 10,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        flex: 1,
        justifyContent: 'space-between'
      },
    containerProfile: {
      flexDirection: 'row',
      marginTop: 15,
      backgroundColor: '#fff',
      shadowColor: 'black',
      shadowRadius: 3.84,
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 2 },
      paddingStart: 10,
      paddingEnd: 5,
      paddingTop: 10,
      paddingBottom: 10,
      elevation: 4,
    },
})