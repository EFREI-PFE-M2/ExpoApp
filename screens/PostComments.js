import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native'
import { IconButton, Divider, Modal, Portal } from 'react-native-paper'
import ProfileAvatar from '../components/ProfileAvatar';
import timeAgoFormat from '../utils/timeAgoFormatter'
import { selectSpecificRacePost, selectSpecificRacePostCommentsLoading, 
  updateSpecificRacePostComments, selectSpecificRacePostNoMoreComments,
  comment as commentRacePost } from '../store/raceSlice'
import { selectPost, selectPostCommentsLoading, updatePostComments, selectPostNoMoreComments, comment as commentSubPost } from '../store/subscriberFeedSlice'
import { selectSpecificGroupPost, selectSpecificGroupPostCommentsLoading, 
  updateSpecificGroupPostComments, selectSpecificGroupPostNoMoreComments,
  comment as commentGroupPost } from '../store/groupSlice'

import { useDispatch, useSelector } from 'react-redux'
import { Keyboard } from 'react-native'


export default function PostComments({ route, navigation }) {

  const { feed, entityID, postID, postOwnerID} = route.params


  const [input, setInput] = React.useState('');
  const [pending, setPending] = useState(false)

  let post
  let commentsLoading 
  let noMoreComments 

  switch(feed){
    case 'race':
      post = useSelector(selectSpecificRacePost(postID))
      commentsLoading = useSelector(selectSpecificRacePostCommentsLoading)
      noMoreComments = useSelector(selectSpecificRacePostNoMoreComments)
      break;
    case 'sub':
      post = useSelector(selectPost(postID))
      commentsLoading = useSelector(selectPostCommentsLoading)
      noMoreComments = useSelector(selectPostNoMoreComments)
      break;
    case 'group':
      post = useSelector(selectSpecificGroupPost(postID))
      commentsLoading = useSelector(selectSpecificGroupPostCommentsLoading)
      noMoreComments = useSelector(selectSpecificGroupPostNoMoreComments)
      break;
  }


  const dispatch = useDispatch()

  useEffect(()=>{
    switch(feed){
      case 'race':
        dispatch(updateSpecificRacePostComments({raceID: entityID, postID: postID}))
        break;
      case 'sub':
        dispatch(updatePostComments({entityID: entityID, postID: postID}))
        break;
      case 'group':
        dispatch(updateSpecificGroupPostComments({entityID: entityID, postID: postID}))
        break;
    }
  },[])
  
  const goBack = () => {
    navigation.goBack()
  }

  const sendComment = (text) => {
    setPending(true)
    switch(feed){
      case 'race':
        dispatch(commentRacePost({raceID: entityID, postID: postID, text: text, postOwnerID: postOwnerID},
          ()=>setPending(false), ()=>setPending(false)))
        break;
      case 'sub':
        dispatch(commentSubPost({entityID: entityID, postID: postID, text: text, postOwnerID: postOwnerID},
          ()=>setPending(false), ()=>setPending(false)))
        break;
      case 'group':
        dispatch(commentGroupPost({entityID: entityID, postID: postID, text: text, postOwnerID: postOwnerID},
          ()=>setPending(false), ()=>setPending(false)))
        break;
    }
    setInput('')
    Keyboard.dismiss()
  }

  const actualise = () => {
    switch(feed){
      case 'race':
        dispatch(updateSpecificRacePostComments({raceID: entityID, postID: postID}))
        break;
      case 'sub':
        dispatch(updatePostComments({entityID: entityID, postID: postID}))
        break;
      case 'group':
        dispatch(updateSpecificGroupPostComments({entityID: entityID, postID: postID}))
        break;
    }
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: '#fff' }}>
        {
          pending && (
          <Portal>
            <Modal visible={true}>
              <View style={{ alignItems: 'center'}}>
                <View style={styles.modal}>
                  <Image source={require('../assets/images/loading_horse_green.gif')}  style={{width: 72, height: 47}} />
                  <Text>Sending...</Text>
                </View>
              </View>
            </Modal>
          </Portal>)
        }
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <View style={styles.header}>
            <View style={{flex: 1}}>
              <IconButton
                icon="chevron-left"
                onPress={goBack}
                size={30}
                color="#fff"
              />
            </View>
            <Text style={{flex: 1, color: '#fff', fontSize: 14, fontWeight: 'bold'}}>Commentaires</Text>
            <View style={{flex: 1}}></View>
          </View>
          <View style={{ flexDirection: 'column', flex: 1}}>
            <View style={{flexDirection: 'row-reverse',margin: 10}}>
              <TouchableOpacity onPress={()=> actualise()}>
                  <Text style={{color: '#757575'}}>Actualiser</Text>
              </TouchableOpacity>  
            </View>
            {commentsLoading &&
              <View style={styles.loadingGif}>
                <Image source={require('../assets/images/loading_horse_green.gif')}  style={{width: 72, height: 47}} />
                <Text>Chargement...</Text>
              </View>
            }
            {
                post && post.comments && post.comments.length > 0 &&
                <FlatList
                  data={post.comments}
                  renderItem={({item}) => 
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={{margin: 5}}><ProfileAvatar url={item.picture}/></View>
                      <View style={{backgroundColor: '#D6D6D6', borderRadius: 10, flexDirection: 'column', paddingHorizontal: 10, paddingVertical: 10, flex: 1, margin : 5}}>
                        <Text style={{fontWeight: 'bold'}}>{item.displayName}</Text>
                        <Text style={{fontSize: 18}}>{item.text}</Text>
                        <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                          <Text style={{color: '#757575'}}>{timeAgoFormat(item.datetime)}</Text>
                        </View>
                        
                      </View>
                    </View>
                  }
                />
              }
              {
                noMoreComments &&
                <View style={{flex: 1, alignItems: 'center', backgroundColor: 'transparent', marginTop: 20, marginBottom: 20}}>
                    <Text>Il n'y a pas plus de commentaires</Text> 
              </View>
              }

          </View>
          <View>
            <Divider />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={{ height: 40, backgroundColor: '#D6D6D6', margin: 10, paddingHorizontal: 10, borderRadius: 10, flex: 1}}
                onChangeText={ text => setInput(text)}
                placeholder='Exprime toi ici...'
                value={input}
              />
              {
                input !== "" &&
                <IconButton
                  icon="send"
                  size={24}
                  color={'#194A4C'}
                  onPress={()=>sendComment(input)}
                />
              }
            </View>
          </View>
        </View>

    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
    header: {
        height: 70,
        backgroundColor: '#194A4C',
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        fontSize: 10,
        color: '#fff'
    },
    loadingGif: {
      flex: 1,
      alignItems: 'center',
      height: 50,
      backgroundColor: 'transparent',
      flexDirection: 'column'
    },
    modal: {
      borderRadius: 10,
      backgroundColor: '#fff', 
      paddingHorizontal: 10, 
      paddingVertical: 10
    }
})

