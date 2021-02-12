import React, { useEffect } from 'react'
import { View} from '../../components/Themed'
import Post from '../../components/Post'
import { StyleSheet, SafeAreaView, RefreshControl, Image, Text, FlatList, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, IconButton, FAB } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

import { selectPosts, updateRecentPosts, 
  selectRecentPostsLoading, selectNextPostsLoading,
  selectNoMorePosts, addNextPosts, likePost, vote} from '../../store/subscriberFeedSlice'
import { selectCurrentUser } from '../../store/userSlice'

export default function HomeSubFeed({ route, navigation }) {

  const posts = useSelector(selectPosts);
  const user = useSelector(selectCurrentUser);
  const recentPostsLoading = useSelector(selectRecentPostsLoading);
  const nextPostsLoading = useSelector(selectNextPostsLoading);
  const noMorePosts = useSelector(selectNoMorePosts);

  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(updateRecentPosts())
  }, [])

  const handleNewPost = () => {
    navigation.navigate('New_Post', {feed: 'sub'})
  }

  const handleActualise = () => {
    dispatch(updateRecentPosts())
  }

  const handleLoadNext = () => {
    dispatch(addNextPosts())
  }

  const handleLikePost = (postID, like, entityID) => {
    dispatch(likePost({postID: postID, like: like, entityID: entityID, userID: user.uid},()=>{}, ()=>{}))
  }

  
  const handleVote = (postID, response, entityID) => {
    dispatch(vote({postID: postID, response: response, entityID: entityID, userID: user.uid},()=>{}, ()=>{}))
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      {recentPostsLoading ? 
        <View style={styles.loadingGif}>
          <Image source={require('../../assets/images/loading_horse_green.gif')}  style={{width: 72, height: 47}} />
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

      <View style={{backgroundColor: 'transparent'}}>
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
                feed='sub'
                entityID={item.userID}
              />
            }
          />
        }
      </View>
      {nextPostsLoading &&
        <View style={styles.loadingGif}>
          <Image source={require('../../assets/images/loading_horse_green.gif')}  style={{width: 72, height: 47}} />
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
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E5E5',
    height: '100%',
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