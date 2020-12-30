import React, { useEffect, useState }  from 'react'
import { Text, TouchableOpacity, StyleSheet, StatusBar, View } from 'react-native'
import { Searchbar, Avatar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
//import { users } from '../store/testChatStore'
import { selectCurrentUser } from '../store/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { searchUsers } from '../store/chatSlice'
import store from '../store'
import { ScrollView } from 'react-native-gesture-handler'

function AddChatScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const dispatch = useDispatch()

  const searchedUsers = useSelector((state) => state.chat.searchedUsers)  
  const displayUser = useSelector(selectCurrentUser)
  
  const { photoURL, username } = displayUser  

  return (<View>
      <View style={styles.searchBar}>
        <Searchbar inputStyle={{color: "#000"}}
        placeholder="Recherche" iconColor="#000" onChangeText={async (query) => { 
          setSearchQuery(query);
          await dispatch(searchUsers(query))
        }}
        value={searchQuery}
        />
      </View>
      <ScrollView>
        {searchedUsers.map((u: any, i: any) => { 
          return(<TouchableOpacity
            key={i}
            style={styles.containerProfile}
            onPress={() =>
              {alert('create chat')} 
            }>
            <Avatar.Image size={40} source={{ uri: u.photoURL }} />
            <View style={{
                        marginStart: 10,
                        marginTop: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}>
              <Text>{u.username}</Text>
            </View>
          </TouchableOpacity>)})}
      </ScrollView>
      </View>
    );
}

export default function AddChat() {
    return (
      <AddChatScreen/>
    )
}

const styles = StyleSheet.create({
    searchBar: {
      borderColor: "#000", 
      borderWidth: 2, 
      borderRadius: 5, 
      marginTop: 10, 
      marginBottom: 10,
      marginLeft: 5,
      marginRight: 5,
    },
    titleStyle: {
      fontWeight: 'bold',
      fontSize: 14,
      color: '#fff',
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
    iconRight: {
        backgroundColor:'#194A4C', 
        paddingTop: 5, 
        paddingEnd: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
        justifyContent: 'flex-end',
    }
})
