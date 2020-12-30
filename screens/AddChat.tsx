import React, { useEffect, useState, useCallback }  from 'react'
import { Text, TouchableOpacity, StyleSheet, StatusBar, View } from 'react-native'
import { Searchbar, Avatar, RadioButton } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { selectCurrentUser } from '../store/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { searchUsers } from '../store/chatSlice'
import { capitalize } from '../utils/ChatFunctions'
import { ScrollView } from 'react-native-gesture-handler'

export default function AddChat({route}) {
  const [searchQuery, setSearchQuery] = useState('')
  const dispatch = useDispatch()

  const searchedUsers = useSelector((state) => state.chat.searchedUsers)  
  const displayUser = useSelector(selectCurrentUser)
  const noResults = 'No results.'

  const [toggleBtn, setToggleBtn] = useState(null)

  const { showState, setShowState } = route.params

  const toggleButton = (buttonId: string) => {
    if (toggleBtn == buttonId)
    {
      setShowState(false)
      setToggleBtn(null)
    } else {
      setShowState(true)
      setToggleBtn(buttonId)
    }      
  }

  //const [count, setCount] = useState(0)

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
      { searchedUsers.length == 0 ?
      <>
      <Text style={{marginStart: 10, marginTop: 10, fontSize: 16}}>{noResults}</Text>
      </>
      :
      <>
      <ScrollView>
        {searchedUsers.map((u: any, i: any) => { 
          const btnId = u.uid
          const isToggled = btnId === toggleBtn;

          return(<TouchableOpacity
            key={btnId}
            style={styles.containerProfile}
            onPress={() => toggleButton(btnId)} 
            >
            <Avatar.Image size={48} source={{ uri: u.photoURL }} />
            <View style={styles.containerView}>
              <Text style={{marginTop: 7}}>{u.username}</Text>
              <View >
                <RadioButton
                  value={btnId}
                  color="#000"
                  uncheckedColor="grey"
                  status={ isToggled ? 'checked' : 'unchecked' }
                  onPress={() => toggleButton(btnId)}
                />
              </View>
              
            </View>
          </TouchableOpacity>)})}
      </ScrollView>
      </>
      }
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
      marginTop: 8,
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
    }
})
