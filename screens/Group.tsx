import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { Button, IconButton, FAB } from 'react-native-paper'
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

import { selectSpecificGroupPosts, updateSpecificGroupRecentPosts, 
  selectSpecificGroupRecentPostsLoading, selectSpecificGroupNextPostsLoading,
  selectSpecificGroupNoMorePosts, addSpecificGroupNextPosts, likePost, vote} from '../store/groupSlice'

const PUBLIC = 'public'
const PRIVE = 'privé'

const Tab = createMaterialTopTabNavigator()

export default function Group({ route, navigation }) {
  const { groupID } = route.params
  const { name, picture, private: isPrivate, nbMembers } = useSelector(
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
          source={{ uri: picture }}
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

function Posts({ route, navigation }) {
  const { groupID } = route.params

  const dispatch = useDispatch()

  const posts = useSelector(selectSpecificGroupPosts);
  const user = useSelector(selectCurrentUser);
  const recentPostsLoading = useSelector(selectSpecificGroupRecentPostsLoading);
  const nextPostsLoading = useSelector(selectSpecificGroupNextPostsLoading);
  const noMorePosts = useSelector(selectSpecificGroupNoMorePosts);


  useEffect(()=> {
    dispatch(updateSpecificGroupRecentPosts(groupID))
  }, [])


  const handleNewPost = () => {
    
    navigation.navigate('New_Post', {
      groupID: groupID, 
      feed: 'group'
    })
  }

  const handleActualise = () => {
    dispatch(updateSpecificGroupRecentPosts(groupID))
  }

  const handleLoadNext = () => {
    dispatch(addSpecificGroupNextPosts(groupID))
  }

  const handleLikePost = (postID, like, entityID) => {
    dispatch(likePost({postID: postID, like: like, entityID: entityID, userID: user.uid},()=>{}, ()=>{}))
  }

  
  const handleVote = (postID, response, entityID) => {
    dispatch(vote({postID: postID, response: response, entityID: entityID, userID: user.uid},()=>{}, ()=>{}))
  }
  
  return (
  <>
  <ScrollView style={{flex: 1}}>
    {recentPostsLoading ? 
        <View style={styles.loadingGif}>
          <Image source={require('../assets/images/loading_horse_green.gif')}  style={{width: 72, height: 47}} />
          <Text>Chargement...</Text>
        </View>
       :
       <View style={styles.pubs}>
        <Text>Publications</Text>
        <TouchableOpacity onPress={handleActualise}>
            <Text style={{color: '#757575'}}>Actualiser</Text>
        </TouchableOpacity>  
      </View>
      }

      <View>
        {
          posts && posts.length > 0 &&
          <FlatList
            data={posts}
            renderItem={({item}) => 
              <Post 
                post={item}
                currentUserID={user.uid}
                handleLikePost={handleLikePost}
                handleVote={handleVote}
                feed='group'
                entityID={groupID}
              />
            }
          />
        }
      </View>
      {nextPostsLoading &&
        <View style={styles.loadingGif}>
          <Image source={require('../assets/images/loading_horse_green.gif')}  style={{width: 72, height: 47}} />
          <Text>Chargement...</Text>
        </View>
      }
      <View style={{flex: 1, alignItems: 'center', backgroundColor: 'transparent', marginTop: 20, marginBottom: 20}}>
          {
            noMorePosts ? <Text>Il n'y a pas plus de posts</Text> : !recentPostsLoading && !nextPostsLoading &&
            <TouchableOpacity onPress={handleLoadNext}>
              <Text style={{color:'#757575'}}>Charger plus
              </Text>
            </TouchableOpacity>
          }
      </View>
  </ScrollView>
  <FAB
        style={styles.fab}
        icon="pen"
        onPress={handleNewPost}
  />
  </>
  )
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
  loadingGif: {
    flex: 1,
    alignItems: 'center',
    height: 50,
    backgroundColor: 'transparent'
  },
  pubs: {
    width: '100%',
    backgroundColor: '#fff0',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})
