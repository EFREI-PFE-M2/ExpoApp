import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Image } from 'react-native'
import { Button, IconButton } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import Post from '../components/Post'
import UserCard from '../components/UserCard'
import UserRequestCard from '../components/UserRequestCard'
import {
  getGroupPosts,
  getMembers,
  getPendingRequests,
  requestJoinGroup,
} from '../store/groupSlice'
import { selectCurrent, selectCurrentUser } from '../store/userSlice'
import { Text, View } from './../components/Themed'

const PUBLIC = 'public'
const PRIVE = 'privé'

const Tab = createMaterialTopTabNavigator()

export default function Group({ route, navigation }) {
  const { groupID } = route.params
  const { name, photoURL, private: isPrivate, nbMembers } = useSelector(
    (state) => state.group?.groups[groupID]
  )
  const dispatch = useDispatch()
  const uid = useSelector(selectCurrent)
  const isMember = useSelector(
    ({ group }) => group.groups[groupID]?.currentUserIsMember
  )

  const goBack = () => navigation.goBack()
  const onPressParameters = () =>
    navigation.navigate('Home_Group_setting', { groupID })
  const onPressJoin = () => dispatch(requestJoinGroup(uid, groupID))

  useEffect(() => {
    dispatch(getPendingRequests(groupID))
    dispatch(getMembers(groupID))
    dispatch(getGroupPosts(groupID))
  }, [])

  navigation.setOptions({
    headerLeft: ({ tintColor }) => (
      <IconButton
        icon="chevron-left"
        size={30}
        color={tintColor}
        onPress={goBack}
      />
    ),
    headerRight: ({ tintColor }) => (
      <IconButton
        icon="dots-horizontal"
        size={24}
        color={tintColor}
        onPress={onPressParameters}
      />
    ),
  })

  return (
    <View style={styles.container}>
      <View style={styles.groupInfoContainer}>
        <Image
          source={{ uri: photoURL }}
          style={styles.photoURL}
          resizeMode="cover"
        />
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.content}>{`Groupe ${
          isPrivate ? PRIVE : PUBLIC
        } - ${nbMembers} membres`}</Text>
        {!isMember && (
          <Button
            mode="contained"
            color="#194A4C"
            style={styles.joinButton}
            onPress={onPressJoin}>
            Rejoindre
          </Button>
        )}
      </View>
      {isMember && (
        <Tab.Navigator
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
          <Tab.Screen
            name="Posts"
            component={Posts}
            initialParams={{ groupID }}
          />
          <Tab.Screen
            name="Membres"
            component={Members}
            initialParams={{ groupID }}
          />
          {isPrivate && (
            <Tab.Screen
              name="Requêtes"
              component={Request}
              initialParams={{ groupID }}
            />
          )}
        </Tab.Navigator>
      )}
    </View>
  )
}

function Posts({ route }) {
  const { groupID } = route.params
  const postList = useSelector(({ group }) => group?.groups[groupID].posts)

  // Render posts from groupeID
  const renderPosts = Object.keys(postList)?.map((element, key) => <Post />)

  return <View>{renderPosts}</View>
}

function Members({ route }) {
  const { groupID } = route.params
  const userList = useSelector(({ group }) => group?.groups[groupID].users)

  return (
    <View>
      {Object.keys(userList)?.map((element, key) => (
        <UserCard user={userList[element]} key={key} />
      ))}
    </View>
  )
}

function Request({ route }) {
  const { groupID } = route.params
  const requestList = useSelector(
    ({ group }) => group?.groups[groupID].requests
  )
  const currentUser = useSelector(({ user }) => user.uid)
  const adminID = useSelector(({ group }) => group.groups[groupID]?.masterID)

  const isAdmin = adminID ? currentUser === adminID : false

  const RenderUserCards = () =>
    Object.keys(requestList)?.map((element, key) => (
      <UserCard user={requestList[element]} key={key} />
    ))

  const RenderAdminUserCards = () =>
    Object.keys(requestList)?.map((element, key) => (
      <UserRequestCard
        user={requestList[element]}
        key={key}
        groupID={groupID}
      />
    ))

  return <View>{isAdmin ? <RenderAdminUserCards /> : <RenderUserCards />}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  groupInfoContainer: {
    flexDirection: 'column',
    height: 180,
    marginHorizontal: 15,
  },
  photoURL: {
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    fontWeight: '500',
  },
  joinButton: {
    position: 'absolute',
    right: 0,
    bottom: 10,
  },
})
