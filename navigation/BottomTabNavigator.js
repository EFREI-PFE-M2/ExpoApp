import * as React from 'react'
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import { IconButton } from 'react-native-paper'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import CardGame from '../screens/CardGame'
import Challenge from '../screens/Challenge'
import ChatList from '../screens/ChatList.js'
import ChatRoom from '../screens/ChatRoom'
import Home from '../screens/HomeTabNavigator'
import Search from '../screens/Search'
import PrivateChatMenuOptions from '../components/Custom/PrivateChatMenuOptions'
import { BottomTabParamList } from '../types'
import { View, StatusBar, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const BottomTab = createBottomTabNavigator()

/**
 * @function BottomTabNavigator
 * @description React Navigation bottom tab navigator,
 * created with createBottomTabNavigator
 * @returns React Node
 */
export default function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  const iconWrapper = {
    size: 24,
  }

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="Home"
        component={TabHomeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="home" color={color} {...iconWrapper} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={TabSearchNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="md-search" color={color} {...iconWrapper} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Challenges"
        component={TabChallengeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="star-outlined" color={color} {...iconWrapper} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Cards"
        component={TabCardGameNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="view-carousel"
              color={color}
              {...iconWrapper}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Messages"
        component={TabMessageNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="mail" color={color} {...iconWrapper} />
          ),
        }}
      />
    </BottomTab.Navigator>
  )
}

const defaultScreenOptions /*: StackNavigationOptions*/ = {
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

/**
 * Home tab navigator
 */
const HomeStack = createStackNavigator()
function TabHomeNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        ...defaultScreenOptions,
        headerRight: ({ tintColor }) => (
          <View>
            <MaterialCommunityIcons name="bell" color={tintColor} size={24} />
          </View>
        ),
        headerRightContainerStyle: {
          marginRight: 15,
        },
        headerTintColor: '#fff',
      }}>
      <HomeStack.Screen
        name="Home_Home"
        component={Home}
        options={{ headerTitle: 'Flux' }}
      />
    </HomeStack.Navigator>
  )
}

/**
 * Search stack navigator
 */
const SearchStack = createStackNavigator()
function TabSearchNavigator() {
  return (
    <SearchStack.Navigator screenOptions={defaultScreenOptions}>
      <SearchStack.Screen
        name="Search_Main"
        component={Search}
        options={{ headerTitle: 'Search' }}
      />
    </SearchStack.Navigator>
  )
}

/**
 * Challenge stack navigator
 */
const ChallengeStack = createStackNavigator()
function TabChallengeNavigator() {
  return (
    <ChallengeStack.Navigator screenOptions={defaultScreenOptions}>
      <ChallengeStack.Screen
        name="Challenge_Main"
        component={Challenge}
        options={{ headerTitle: 'Défis' }}
      />
    </ChallengeStack.Navigator>
  )
}

/**
 * CardGame stack navigator
 */
const CardGameStack = createStackNavigator()
function TabCardGameNavigator() {
  return (
    <CardGameStack.Navigator screenOptions={defaultScreenOptions}>
      <CardGameStack.Screen
        name="CardGame_Main"
        component={CardGame}
        options={{ headerTitle: 'Cartes' }}
      />
    </CardGameStack.Navigator>
  )
}

import AddChat from '../screens/AddChat'
/**
 * ChatList stack navigator
 */
const MessageStack = createStackNavigator()
function TabMessageNavigator() {
  //type RootStackParamList = {AddChat: undefined}
  //type ScreenNavigationProp = StackNavigationProp<RootStackParamList>
  //const navigation = useNavigation<ScreenNavigationProp>()
  return (
    <MessageStack.Navigator
      screenOptions={{
        ...defaultScreenOptions,
        headerRight: ({ tintColor }) => (
          <View>
            <IconButton
              icon="message-plus"
              color={tintColor}
              size={22}
              onPress={() => {} /*navigation.navigate('AddChat')*/}
            />
          </View>
        ),
        headerRightContainerStyle: {
          marginRight: 5,
        },
        headerTintColor: '#fff',
      }}>
      <MessageStack.Screen
        name="Messages"
        component={ChatList}
        options={{ headerTitle: 'Messages' }}
      />
      <MessageStack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={({ route }) => ({
          title: route.params.title,
          headerTitleAlign: 'left',
          headerRight: ({ tintColor }) => (
            <View style={styles.iconRight}>
              <PrivateChatMenuOptions />
            </View>
          ),
          headerTintColor: '#fff',
        })}
      />
    </MessageStack.Navigator>
  )
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
