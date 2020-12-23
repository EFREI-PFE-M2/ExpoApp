import React from 'react'
import { Text, TouchableOpacity, StyleSheet, StatusBar, View } from 'react-native'
import { Searchbar, Avatar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { users } from '../store/testChatStore'

function AddChatScreen() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchedUsers, setSearchedUsers] = React.useState(users)
  const navigation = useNavigation()

  return (<View>
      <View style={styles.searchBar}>
        <Searchbar inputStyle={{color: "#000"}}
        placeholder="Recherche" iconColor="#000" onChangeText={(query) => { 
          setSearchQuery(query); 
          let array = users.filter(u => u.name.includes(query));
          setSearchedUsers(array);
        }}
        value={searchQuery}
        />
      
      </View>
      {searchedUsers.map((u, i) => {
        return (
          <TouchableOpacity
            key={i}
            style={styles.containerProfile}
            onPress={() =>
              navigation.navigate('ChatRoom', {
                title: (
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                    }}>
                    <Avatar.Image
                      size={45}
                      source={{ uri: u.avatar }}
                    />
                    <View
                      style={{
                        marginStart: 10,
                        flexDirection: 'column',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}>
                      <Text style={styles.titleStyle}>
                        {u.name}
                      </Text>
                    </View>
                  </View>
                ),
              })
            }>
            <Avatar.Image size={40} source={{ uri: u.avatar }} />
            <View style={{
                        marginStart: 10,
                        marginTop: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}>
              <Text>{u.name}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
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
