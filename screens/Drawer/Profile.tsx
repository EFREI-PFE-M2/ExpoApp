import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { StyleSheet } from 'react-native'
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  ProgressBar,
} from 'react-native-paper'
import { useSelector } from 'react-redux'
import Badges from '../../components/ProfileTabs/Badges'
import CardCollection from '../../components/ProfileTabs/CardCollection'
import Challenges from '../../components/ProfileTabs/Challenges'
import Posts from '../../components/ProfileTabs/Posts'
import { selectCurrentUser } from '../../store/userSlice'
import { Text, View } from './../../components/Themed'
import { createStackNavigator } from '@react-navigation/stack'

const SubTab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

export default function Profile(props) {
  const { user, route } = props
  const displayUser = route.params.self ? useSelector(selectCurrentUser) : user
  const {
    uid,
    photoURL,
    username,
    level,
    experience,
    winPercentage,
    nbFollowers,
    nbFollowing,
  } = displayUser

  const renderXPCard = () => (
    <View style={XPCardStyles.container}>
      <View style={XPCardStyles.level}>
        <Text style={XPCardStyles.label}>Niveau</Text>
        <Badge size={24} style={XPCardStyles.badge}>
          {level}
        </Badge>
      </View>
      <ProgressBar progress={0.5} color="#194A4C" style={XPCardStyles.bar} />
    </View>
  )

  const renderUserInformation = () => (
    <View style={infoCardStyles.container}>
      <Text style={infoCardStyles.username}>{username}</Text>
      <View style={infoCardStyles.container}>
        <IconButton color="#194A4C" size={32} icon="message" />
        <View style={{ width: 10 }} />
        <IconButton color="#194A4C" size={32} icon="account-multiple-plus" />
      </View>
    </View>
  )

  const renderStats = () => (
    <View style={infoCardStyles.container}>
      <Text>
        Gagnés <Text style={infoCardStyles.label}>{winPercentage}%</Text>
      </Text>
    </View>
  )

  const renderFollowers = () => (
    <View style={infoCardStyles.container}>
      <Text>
        <Text style={infoCardStyles.label}>{nbFollowing}</Text> Abonnements
      </Text>
      <Text>
        <Text style={infoCardStyles.label}>{nbFollowers}</Text> Abonnés
      </Text>
    </View>
  )

  const renderTabNavigator = () => (
    <SubTab.Navigator
      tabBarOptions={{
        labelStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#194A4C',
        },
        indicatorStyle: {
          backgroundColor: '#194A4C',
        },
        showLabel: true,
        showIcon: true,
        tabStyle: {
          flexDirection: 'row',
        },
      }}>
      <SubTab.Screen
        name="Posts"
        component={Posts}
        options={{ title: 'Posts' }}
      />
      <SubTab.Screen
        name="Badges"
        component={Badges}
        options={{ title: 'Badges' }}
      />
      <SubTab.Screen
        name="Challenges"
        component={Challenges}
        options={{ title: 'Défis' }}
      />
      <SubTab.Screen
        name="Cartes"
        component={CardCollection}
        options={{ title: 'Cartes' }}
      />
    </SubTab.Navigator>
  )

  return (
    <View style={styles.container}>
      <View
        style={{ height: 80, backgroundColor: '#194A4C', marginBottom: 20 }}
      />
      <View style={styles.banner}>
        <Avatar.Image source={{ uri: photoURL }} size={65} />
        {renderXPCard()}
      </View>
      {renderUserInformation()}
      {renderStats()}
      {renderFollowers()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
})

const XPCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 5,
  },
  level: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#000',
  },
  bar: {
    width: 150,
  },
  badge: {
    backgroundColor: '#194A4C',
    marginLeft: 10,
  },
})

const infoCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginVertical: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
})