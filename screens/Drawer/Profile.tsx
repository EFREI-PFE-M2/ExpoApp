import React, { useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import Badges from '../../components/ProfileTabs/Badges'
import CardCollection from '../../components/ProfileTabs/CardCollection'
import Challenges from '../../components/ProfileTabs/Challenges'
import Posts from '../../components/ProfileTabs/Posts'
import { selectCurrentUser } from '../../store/userSlice'

import { selectForeignUser, updateForeignUser, follow } from '../../store/foreignUserSlice'
import { Text, View } from './../../components/Themed'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileAvatar from '../../components/ProfileAvatar';

const SubTab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

export default function Profile(props) {
  const { user, route, navigation } = props

  const dispatch = useDispatch()

  const displayUser = route.params.id === -1  ? useSelector(selectCurrentUser) : useSelector(selectForeignUser)

  useEffect(()=>{ 
    if(route.params.id !== -1){
      dispatch(updateForeignUser(route.params.id))
    }
  },[route.params.id])


  const {
    uid,
    photoURL,
    displayName,
    level,
    experience,
    nbWin,
    nbFollowers,
    nbFollowing,
    currentSeries,
    isFollowed,
    nbBets
  } = displayUser || {}

  const profileHeader = route.params.id === -1 ? 'Mon Profil' : displayName

  const requestFollow = () => {
    dispatch(follow({followedID: route.params.id, follow: !isFollowed}))
  }

  const renderXPCard = () => (
    <View style={XPCardStyles.container}>
      <View style={XPCardStyles.level}>
        <Text style={XPCardStyles.label}>Niveau</Text>
        <Badge size={32} style={XPCardStyles.badge}>
          {level}
        </Badge>
      </View>
      <Text style={{color: '#194A4C', marginBottom: 3}}>{experience} xp</Text>
      <ProgressBar progress={experience/100} color="#194A4C" style={XPCardStyles.bar} />
    </View>
  )

  const renderUserInformation = () => (
    <View style={infoCardStyles.container}>
      <Text style={infoCardStyles.username}>{displayName}</Text>
      {/*route.params.id !== -1 && 
        <View style={[infoCardStyles.container, { paddingRight: 0 }]}>
          <IconButton color="#194A4C" size={32} icon="message" />
          <View style={{ width: 10 }} />
          <IconButton color="#194A4C" size={32} icon="account-multiple-plus" />
        </View>
      */}
    </View>
  )

  const renderStats = () => (
    <View style={infoCardStyles.container}>
      <Text style={{color: '#757575', marginRight: 3}}>Pronos</Text><Text style={infoCardStyles.label}>{nbBets ||0}</Text>
      <Text style={{color: '#757575', marginRight: 3}}>Gagnés</Text><Text style={infoCardStyles.label}>{nbBets && nbWin ? (nbWin/nbBets)*100 : 0}%</Text>
    </View>
  )

  const renderFollowers = () => (
    <View style={infoCardStyles.container}>
      <Text style={infoCardStyles.label}>{nbFollowing}</Text><Text style={{color: '#757575', marginRight: 5}}>Abonnements</Text>
      <Text style={infoCardStyles.label}>{nbFollowers}</Text><Text style={{color: '#757575', marginRight: 5}}>Abonnés</Text>
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
      <Text style={{color: '#757575', marginRight: 3}}>Série en cours:</Text>
      {
      currentSeries?.length > 0 ?
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
      :
      <Text>Aucune</Text>
      }
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
      {(route.params.id === -1 ? 
      <IconButton icon="account-edit" 
        onPress={edit}
        size={30}
        color="#fff"/> 
        : 
          isFollowed ? 
          <IconButton icon="check" 
          onPress={()=> requestFollow()}
          size={30}
          color="#fff"/>
          :
          <IconButton icon="account-plus" 
          onPress={()=> requestFollow()}
          size={30}
          color="#fff"/>
      )}
    </View>
  )

  const goBack = () => { navigation.goBack() }
  const edit = () => console.log('editing')


  return (
    <View style={styles.container}>
      {renderTopBar()}
      <View style={styles.banner}>
        <ProfileAvatar url={photoURL}/>
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
    paddingHorizontal: 15,
    alignItems: 'center',
    marginVertical: 5,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 5
  },
})