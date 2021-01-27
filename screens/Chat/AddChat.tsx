import React, { useState }  from 'react'
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native'
import { Searchbar, Avatar, RadioButton } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { searchUsers, selectUsers, selectUsersToSearch } from '../../store/chatSlice'
import { ScrollView } from 'react-native-gesture-handler'

export default function AddChat(props: any) {
  const [searchQuery, setSearchQuery] = useState('')
  const dispatch = useDispatch()

  const sUsers = useSelector(selectUsersToSearch)  
  const noResults = 'No results.'

  const [usersToAdd, setUsersToAdd] = useState({})

  const { groupChatID, isCreated, setShowState } = props.route.params

  const toggleButton = (buttonId: string, user: any) => () => {
    let aUsers = Object.assign({}, usersToAdd)
      // click on the same user twice
    if (Object.keys(aUsers).includes(buttonId)) {
      delete aUsers[buttonId]
      
    } else { // first time
      aUsers[buttonId] = {
        uid: user.uid,
        username: user.username,
        photoURL: user.photoURL
      } 
    }

    if (!isCreated) {
      if (Object.keys(aUsers).length == 0) {
        setShowState(false)
      } else {
        setShowState(true)
      }
    }
    
    setUsersToAdd(aUsers) 
    dispatch(selectUsers(aUsers))    
  }

  const onChangeText = (query: any) => { 
    setSearchQuery(query);
    if (isCreated)
      dispatch(searchUsers(query, groupChatID))
    else 
      dispatch(searchUsers(query))
  }

  const checkStatus = (isToggled: boolean) => { 
    return isToggled ? 'checked' : 'unchecked' 
  }

  return (<View>
      <View style={styles.searchBar}>
        <Searchbar inputStyle={{color: "#000"}}
        placeholder="Recherche" iconColor="#000" onChangeText={onChangeText}
        value={searchQuery}
        />
      </View>
      <ScrollView>
      { sUsers.length == 0 ?
        <>
          <Text style={styles.noResults}>{noResults}</Text>
        </>
        :
        <>
          { sUsers.map((u: any) => { 
            const btnId = u.uid
            const isToggled = Object.keys(usersToAdd).includes(btnId) 

            return (<TouchableOpacity
              key={btnId}
              style={styles.containerProfile}
              onPress={toggleButton(btnId, u)} 
              >
              <Avatar.Image size={60} source={{ uri: u.photoURL }} />
              <View style={styles.containerView}>
                <Text style={styles.usernameStyle}>{u.username}</Text>
                <View >
                  <RadioButton
                    value={btnId}
                    color="#000"
                    uncheckedColor="grey"
                    status={checkStatus(isToggled)}
                    onPress={toggleButton(btnId, u)}
                  />
                </View>  
              </View>
            </TouchableOpacity>)
            })
          }
        </>
      }
      </ScrollView>
    </View>
    );
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
    iconRight: {
        backgroundColor:'#194A4C', 
        paddingTop: 5, 
        paddingEnd: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
        justifyContent: 'flex-end',
    },
    usernameStyle: {
      marginTop: 8
    },
    noResults: {
      marginStart: 10, 
      marginTop: 10, 
      fontSize: 16
    }
})
