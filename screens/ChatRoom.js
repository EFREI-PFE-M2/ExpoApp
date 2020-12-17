import React, { ReactPropTypes } from 'react'
import { StyleSheet, ScrollView, StatusBar, Image } from 'react-native'
import { Text, View } from '../components/Themed'
import ChatFooter from '../components/Custom/ChatFooter'
import { Avatar } from 'react-native-paper'
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import { MaterialIcons } from '@expo/vector-icons'

const MessageStack = createStackNavigator()

const defaultScreenOptions = {
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#194A4C',
  },
  headerTitleStyle: {
    //color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerStatusBarHeight: StatusBar.currentHeight,
}

function ChatRoomScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView></ScrollView>
      <ChatFooter />
    </View>
  )
}

const avatar =
  'https://images.ladbible.com/resize?type=jpeg&url=http://beta.ems.ladbiblegroup.com/s3/content/a87d98d35f68c2fc94b0604a44d2e0dc.png&quality=70&width=720&aspectratio=16:9&extend=white'

const name = 'The Rock'

export default function ChatRoom() {
  return <ChatRoomScreen />
  /*return (
    <MessageStack.Navigator screenOptions={{ ...defaultScreenOptions }}>
      <MessageStack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerRight: ({ tintColor }) => (
            <View style={styles.iconRight}>
              <MaterialIcons
                name="more-vert"
                color={tintColor}
                size={24}
                onPress={() => {
                  // go for menu options
                }}
              />
            </View>
          ),
          headerTintColor: '#fff',
        })}
      />
    </MessageStack.Navigator>
  )*/
}

const styles = StyleSheet.create({
  iconRight: {
    backgroundColor: '#194A4C',
    paddingTop: 5,
    paddingEnd: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'flex-end',
  },
})
