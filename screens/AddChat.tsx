import React from 'react'
import { StyleSheet, StatusBar, View } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack'
import { MaterialIcons } from '@expo/vector-icons'

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

class AddChatScreen extends React.Component {
    /*const [searchQuery, setSearchQuery] = React.useState('')
    const onChangeSearch = (query: string) => setSearchQuery(query)
    const state = {
        search: '',
      };
    
      /*const updateSearch = (search: string) => {
        setState({ search });
      };
    return (<View>
        <Searchbar placeholder="Search"/>
  </View>)*/
  state = {
    firstQuery: '',
  };

  render() {
    const { firstQuery } = this.state;
    return (<View>
      <Searchbar inputStyle={{color: "#000"}}
        placeholder="Search" iconColor="#000"
        onChangeText={query => { this.setState({ firstQuery: query }); }}
        value={firstQuery}
      /></View>
    );
}}

export default function AddChat() {
    return (
      <Stack.Navigator 
      screenOptions={{...defaultScreenOptions}}>
        
       <Stack.Screen
          name="AddChat"
          component={AddChatScreen}
          options={{ headerTitle: 'AddChat', 
          headerTintColor: '#fff'}}
        />
      </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
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
