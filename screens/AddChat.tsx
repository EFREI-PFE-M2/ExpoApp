import React from 'react'
import { Text, TouchableOpacity, StyleSheet, StatusBar, View } from 'react-native'
import { Searchbar, Avatar } from 'react-native-paper'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const Stack = createStackNavigator()

const defaultScreenOptions: StackNavigationOptions = {
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#194A4C',
  },
  headerTitleStyle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerStatusBarHeight: StatusBar.currentHeight,
}

const users = [
  {
    name: 'Joe Biden',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxBQF3-OpG82AZOw8GM5CZ1eMlSH9-hK7wUQ&usqp=CAU',
  },
  {
    name: 'Emmanuel Macron',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Emmanuel_Macron_%28cropped%29.jpg/220px-Emmanuel_Macron_%28cropped%29.jpg',
  },
  {
    name: 'Donald Trump',
    avatar:
      'https://www.challenges.fr/assets/img/2018/05/28/cover-r4x3w1000-5b0fbf7445ff2-trump-annonce-l-arrivee-d-emissaires-us-en-coree-du-nord.jpg',
  },
  {
    name: 'Bruce Lee',
    avatar:
      'https://www.jeetkunedoconcept.fr/wp-content/uploads/sites/11/2018/08/bruce-lee-4-1024x576.jpg',
  },
  {
    name: 'John Cena',
    avatar:
      'https://i.kym-cdn.com/entries/icons/facebook/000/007/797/john-cena-missing-777x437.jpg',
  },
  {
    name: 'Dwayne "The Rock" Johnson',
    avatar:
      'https://images.ladbible.com/resize?type=jpeg&url=http://beta.ems.ladbiblegroup.com/s3/content/a87d98d35f68c2fc94b0604a44d2e0dc.png&quality=70&width=720&aspectratio=16:9&extend=white',
  },
  {
    name: 'Uncle Roger',
    avatar:
      'https://monodramatic.com/wp-content/uploads/2020/09/uncle_roger_reaction_rice_bbc_%C2%A9uncleroger_youtube_video-850x567.jpg',
  },
  {
    name: 'Gordon Ramsay',
    avatar:
      'https://pyxis.nymag.com/v1/imgs/8d7/8d1/a6b94063a43171a380fb9c6b1c4da37f8f-20-gordon-ramsay.rsquare.w1200.jpg',
  },
  // more users here
]

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
