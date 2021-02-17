import * as React from 'react'
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import CardGame from '../screens/CardGame'
import Challenge from '../screens/Challenge'
import Home from '../screens/HomeTabNavigator'
import Search from '../screens/Search'
import { StatusBar } from 'react-native'
import { IconButton, TouchableRipple } from 'react-native-paper'
import Race from '../screens/Race'
import Group from '../screens/Group'
import GroupParameters from '../screens/GroupParameters'
import Profile from '../screens/Drawer/Profile'


const BottomTab = createBottomTabNavigator()

/**
 * @function BottomTabNavigator
 * @description React Navigation bottom tab navigator,
 * created with createBottomTabNavigator
 * @returns React Node
 */
export default function BottomTabNavigator({ navigation }) {
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
          tabBarLabel: 'Rechercher',
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
    </BottomTab.Navigator>
  )
}

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
  headerTintColor: '#fff',
  headerStatusBarHeight: StatusBar.currentHeight,
}

/**
 * Home tab navigator
 */
const HomeStack = createStackNavigator()
function TabHomeNavigator({ navigation }) {
  return (
    <HomeStack.Navigator
      screenOptions={{
        ...defaultScreenOptions,
        headerRight: ({ tintColor }) => (
          <IconButton icon="bell" size={24} color={tintColor} onPress={() => navigation.navigate('Notifications')} />
        ),
        headerLeft: ({ tintColor }) => (
          <IconButton
            onPress={() => navigation.openDrawer()}
            icon="menu"
            size={24}
            color={tintColor}
          />
        ),
      }}>
      <HomeStack.Screen
        name="Home_Home"
        component={Home}
        options={{ headerTitle: 'Flux' }}
      />
      <HomeStack.Screen
        name="Home_Race"
        component={Race}
        options={{ headerTitle: 'Course' }}
      />
      <HomeStack.Screen
        name="Home_Group"
        component={Group}
        options={{ headerTitle: 'Groupe' }}
      />
      <HomeStack.Screen
        name="Home_Group_setting"
        component={GroupParameters}
        options={{ headerTitle: 'Paramètres' }}
      />
      <HomeStack.Screen name="Home_Profile" component={Profile} />
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
        options={{ headerTitle: 'Rechercher' }}
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
export function TabCardGameNavigator() {
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
