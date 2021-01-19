import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { StyleSheet } from 'react-native'
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  ProgressBar,
  TouchableRipple,
} from 'react-native-paper'
import { useSelector } from 'react-redux'
import Badges from '../../components/ProfileTabs/Badges'
import CardCollection from '../../components/ProfileTabs/CardCollection'
import Challenges from '../../components/ProfileTabs/Challenges'
import Posts from '../../components/ProfileTabs/Posts'
import { selectCurrentUser } from '../../store/userSlice'
import { Text, View } from './../../components/Themed'
import { createStackNavigator } from '@react-navigation/stack'
import { MaterialIcons } from '@expo/vector-icons'

const SubTab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

export default function Profile(props) {
  const { user, route, navigation } = props
  const displayUser = route.params.self ? useSelector(selectCurrentUser) : route.params.user
  const {
    uid,
    photoURL,
    username,
    level,
    experience,
    winPercentage,
    nbFollowers,
    nbFollowing,
    currentSeries,
  } = displayUser

  const profileHeader = route.params.self ? 'Mon Profil' : username

  const renderXPCard = () => (
    <View style={XPCardStyles.container}>
      <View style={XPCardStyles.level}>
        <Text style={XPCardStyles.label}>Niveau</Text>
        <Badge size={32} style={XPCardStyles.badge}>
          {level}
        </Badge>
      </View>
      <ProgressBar progress={0.5} color="#194A4C" style={XPCardStyles.bar} />
    </View>
  )

  const renderUserInformation = () => (
    <View style={infoCardStyles.container}>
      <Text style={infoCardStyles.username}>{username}</Text>
      {!self && 
        <View style={[infoCardStyles.container, { paddingRight: 0 }]}>
          <IconButton color="#194A4C" size={32} icon="message" />
          <View style={{ width: 10 }} />
          <IconButton color="#194A4C" size={32} icon="account-multiple-plus" />
        </View>
      }
    </View>
  )

  const renderStats = () => (
    <View style={infoCardStyles.container}>
      <Text>
        Pronos <Text style={infoCardStyles.label}>999</Text>
      </Text>
      <Text>
        Gagnés <Text style={infoCardStyles.label}>{winPercentage}%</Text>
      </Text>
      <Text>
        Perdus <Text style={infoCardStyles.label}>{100  -  winPercentage}%</Text>
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
          fontSize: 12,
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

  const renderCurrentSeries = () => (
    <View style={infoCardStyles.container}>
      <Text>Serie en cours</Text>
      <View style={[infoCardStyles.container, { paddingRight: 0 }]}>
        {currentSeries?.map((serie) => (
          <Badge
            size={16}
            style={{
              backgroundColor: serie ? '#194A4C' : '#C4C4C4',
              marginHorizontal: 2,
            }}
          />
        ))}
      </View>
    </View>
  )

  const renderTopBar = () => (
    <View
      style={{
        height: 90,
        backgroundColor: '#194A4C',
        paddingTop: 35,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      <IconButton 
        icon="chevron-left"
        onPress={goBack}
        size={30}
        color="#fff"
      />
      <Text style={{fontSize:24, fontWeight:'bold', color:"#fff"}}>{profileHeader}</Text>
      {(route.params.self ? 
      <IconButton icon="account-edit" 
        onPress={edit}
        size={30}
        color="#fff"/> 
        : <IconButton icon="account-plus" 
        onPress={follow}
        size={30}
        color="#fff"/>)}
    </View>
  )

  const goBack = () => { navigation.setParams({self: true }); navigation.goBack(); }
  const edit = () => console.log('editing')
  const follow = () => console.log('follow')

  return (
    <View style={styles.container}>
      {renderTopBar()}
      <View style={styles.banner}>
        <Avatar.Image source={{ uri: photoURL }} size={65} />
        {renderXPCard()}
      </View>
      {renderUserInformation()}
      {renderStats()}
      {renderCurrentSeries()}
      {renderFollowers()}
      {renderTabNavigator()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
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
    fontWeight: 'bold',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
})