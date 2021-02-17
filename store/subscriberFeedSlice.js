import { createSlice } from '@reduxjs/toolkit'
import { FirebaseApp as firebase } from '../firebase'
import { FirebaseFirestore as firestore } from '../firebase'
import uploadImage from '../utils/uploadImage'
import { createSelector } from 'reselect'

const PAGINATION = 3

export const subscriberFeedSlice = createSlice({
  name: 'subscriberFeed',
  initialState: {
    posts: [],
    recentPostsLoading: false,
    nextPostsLoading: false,
    noMorePosts: false,
    postCommentsLoading: false,
    postNoMoreComments: false
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload
    },
    addPostToMostRecent: (state, action) => {
      if(state.posts)
        state.posts =  [...action.payload, ...state.posts]
      else
        state.posts =  action.payload
    },
    addPosts: (state, action) => {
      if(state.posts)
        state.posts =  [...state.posts, ...action.payload]
      else
        state.posts =  action.payload
    },
    setRecentPostsLoading: (state, action) => {
      state.recentPostsLoading = action.payload
    },
    setNextPostsLoading: (state, action) => {
      state.nextPostsLoading = action.payload
    },
    setNoMorePosts: (state, action) => {
      state.noMorePosts = action.payload
    },
    setPostLikeStatus: (state, action) => {
      let { postID, like } = action.payload
      state.posts = state.posts.map((post)=>
      post.id === postID ? {...post, alreadyLiked: like, nbLikes: like ? post.nbLikes+1 : post.nbLikes-1} : post)
    },
    setPostVoteStatus: (state, action) => {
      let { postID, response } = action.payload
      state.posts = state.posts.map((post)=>
      post.id === postID ? {...post, userVote: response, responses: {...post.responses, [response]: post.responses[response] + 1}} : post)
    },
    setPostVoteComments: (state, action) => {
      let { comments, postID } = action.payload
      state.posts = state.posts.map((post)=>
      post.id === postID ? {...post, comments: comments} : post)
    },
    setPostCommentsLoading: (state, action) => {
      state.postCommentsLoading = action.payload
    },
    setPostNoMoreComments: (state, action) => {
      state.postNoMoreComments = action.payload
    },
    addPostComment: (state, action) => {
      let { comment, postID } = action.payload
      state.posts = state.posts.map((post)=>
      post.id === postID ? {...post, nbComments: post.nbComments + 1, comments: [...post?.comments, comment]} : post)
    },
  },
})

//actions imports
export const { setPosts, addPostToMostRecent, addPosts, setRecentPostsLoading, setNextPostsLoading,
  setNoMorePosts, setPostLikeStatus, setPostVoteStatus, setPostVoteComments, setPostCommentsLoading, setPostNoMoreComments,
  addPostComment} = subscriberFeedSlice.actions

// thunks

export const updateRecentPosts = () => async (dispatch, getState) => {
  try {

    let userID = getState().user.uid

    dispatch(setPosts([]))
    dispatch(setNoMorePosts(false))
    dispatch(setRecentPostsLoading(true))
    
    const followedSnapshot  = await firestore
      .collection('Follows')
      .where('followerID', '==', userID ).get()


    if (followedSnapshot.empty) {
        console.log('No one followed');
        dispatch(setRecentPostsLoading(false))
        dispatch(setNoMorePosts(true))
        return;
    } 

    let followedUsersIDs = [userID]
    followedSnapshot.forEach((doc) => {
      let data = doc.data()
      followedUsersIDs.push(data.followedID)
    });

    const postsSnapshot = await firestore.collectionGroup('UserPosts').where('userID', 'in', followedUsersIDs)
    .orderBy('datetime','desc')
    .limit(PAGINATION)
    .get();
    
    if (postsSnapshot.empty) {
      console.log('No posts from followed users');
      dispatch(setRecentPostsLoading(false))
      dispatch(setNoMorePosts(true))
      return;
    }
      
    
      let posts = []

      for(doc of postsSnapshot.docs) {
        let post = doc.data()
        delete post.createdAt
        post.id = doc.id
        let isAlreadyLiked = await doc.ref.collection('Likes').where('userID', '==', userID).get()
        if(!isAlreadyLiked.empty)
          post.alreadyLiked = true
        else
          post.alreadyLiked = false

        if(post.type === "survey"){
          
          let voteDocs = await doc.ref.collection('Votes').where('userID', '==', userID).get()
          if (!voteDocs.empty) {
            let vote;
            voteDocs.forEach(voteDoc => {
              vote = voteDoc.data()
            });
            post.userVote = vote.response;
          } 
        }

        posts.push(post)
      }


      
      dispatch(setPosts(posts))

      
      //hide loading indicator
      dispatch(setRecentPostsLoading(false))
  } catch (err) {
    alert('Erreur interne')
    console.error(err)
    dispatch(setRecentPostsLoading(false))
  }
}

export const addNextPosts = () => async (dispatch, getState) => {
  try {
    let userID = getState().user.uid
    let currentPosts = getState().subscriberFeed.posts;

    if(currentPosts.length < 1)
      return;

    let lastPost = currentPosts[currentPosts.length-1];

    dispatch(setNextPostsLoading(true))

    const followedSnapshot  = await firestore
      .collection('Follows')
      .where('followerID', '==', userID ).get()


    if (followedSnapshot.empty) {
        console.log('No one followed');
        dispatch(setNextPostsLoading(false))
        dispatch(setNoMorePosts(true))
        return;
    } 

    let followedUsersIDs = [userID]
    followedSnapshot.forEach((doc) => {
      let data = doc.data()
      followedUsersIDs.push(data.followedID)
    });

    const postsSnapshot = await firestore.collectionGroup('UserPosts').where('userID', 'in', followedUsersIDs)
      .orderBy('datetime','desc')
      .startAfter(lastPost.datetime)
      .limit(PAGINATION)
      .get();

      if (postsSnapshot.empty) {
        dispatch(setNextPostsLoading(false))
        dispatch(setNoMorePosts(true))
        console.log('No matching documents.');
        return;
      } 

      let posts = []
      postsSnapshot.forEach(doc => {
        let post = doc.data()
        delete post.createdAt
        post.id = doc.id
        posts.push(post)
      });

      dispatch(addPosts(posts))

      //hide loading indicator
      dispatch(setNextPostsLoading(false))
  } catch (err) {
    console.error(err)
  }
}

export const newPost = (data, cbSuccess, cbError) => async (dispatch) => {
  
  try{
    let {user, text, image, survey, bet, entityID} = data;
    
    let currentDate = new Date()
    
    let post = {
      nbLikes: 0,
      nbComments: 0,
      datetime: currentDate.toISOString(),
      displayName: user.displayName,
      profilePicture: user.photoURL,
      userID: user.uid,
      text: text.trim(), 
    }
    if(image){
      post.type= 'image'
      let imageName = image.substring(image.lastIndexOf('/')+1);
      let milliDate = currentDate.getTime() 
      
      let uploadedUrl = await uploadImage(image, milliDate+imageName, 'posts')//add to firebase storage
      post.image = uploadedUrl

    }else if(survey){
      post.type = 'survey'
      post.expirationDate = new Date(currentDate.getTime() + survey.nbMinutesDuration*60000).toISOString();
      post.responses = survey.responses.filter((res)=>res.length > 1).map((res)=>({[res.trim()]: 0 }))
      .reduce((result, item)=>({...result, ...item}), {})
      post.userVote = null
    }else if(bet){
      post.type= 'bet'
      post.won = null
      post.nbCopiedBets = 0
      post = {...post, ...bet}
    }


    await firestore.collection(`Users/${entityID}/UserPosts`).add(post)//insert in firestore

    dispatch(addPostToMostRecent([post]))//add to local store

    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}


export const likePost = (data, cbSuccess, cbError) => async (dispatch) => {
  
  try{
    let { postID, like, entityID, userID, postOwnerID } = data
    
    const likePostCloudFunction = firebase.functions('europe-west1').httpsCallable('likePost')
    await likePostCloudFunction({feed: 'sub', entityID: entityID,
       postID: postID, userID: userID, like: like, postOwnerID: postOwnerID})
    
    //set local store
    dispatch(setPostLikeStatus({postID: postID, like: like}))
    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}


export const vote = (data, cbSuccess, cbError) => async (dispatch) => {
  
  try{
    let { postID, entityID, userID, response } = data
    
    const voteCloudFunction = firebase.functions('europe-west1').httpsCallable('vote')
    let res = await voteCloudFunction({feed: 'sub', entityID: entityID,
       postID: postID, userID: userID, response: response})
      console.log('TEST',res)
    
    //set local store
    dispatch(setPostVoteStatus({postID: postID, response: response}))
    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}


export const updatePostComments = (data) => async (dispatch) => {
  try {

    let { entityID, postID } = data


    dispatch(setPostVoteComments({comments: [], postID: postID}))
    dispatch(setPostNoMoreComments(false))
    dispatch(setPostCommentsLoading(true))
    
    //make query
    const snapshot  = await firestore
      .collection(`Users/${entityID}/UserPosts/${postID}/Comments`)
      .orderBy('datetime','asc')
      .get();

      if (snapshot.empty) {
        console.log('No matching document');
        dispatch(setPostCommentsLoading(false))
        dispatch(setPostNoMoreComments(true))
        return;
      } 
      let comments = []

      for(doc of snapshot.docs) {
        let comment = doc.data()
        delete comment.createdAt

        comments.push(comment)
      } 
      
      dispatch(setPostVoteComments({comments: comments, postID: postID}))
      
      //hide loading indicator
      dispatch(setPostCommentsLoading(false))
  } catch (err) {
    alert('Erreur interne')
    console.error(err)
    dispatch(setPostCommentsLoading(false))
  }
}


export const comment = (data, cbSuccess, cbError) => async (dispatch, getState) => {
  let currentDate = new Date()
  let currentUser = getState().user
  try{
    let { entityID, postID, text, postOwnerID } = data

    let comment = {
      datetime: currentDate.toISOString(), 
      displayName: currentUser.displayName, 
      picture: currentUser.photoURL, 
      userID: currentUser.uid, 
      text: text
    }

    
    const commentCloudFunction = firebase.functions('europe-west1').httpsCallable('comment')
    await commentCloudFunction({feed: 'sub', entityID: entityID, postID: postID, userID: currentUser.uid, datetime: currentDate.toISOString(), 
      displayName: currentUser.displayName, picture: currentUser.photoURL, text: text, postOwnerID: postOwnerID})

    
    //set local store
    dispatch(addPostComment({comment: comment, postID: postID}))
    dispatch(setPostNoMoreComments(false))

    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}

// selectors
export const selectPosts = state => state.subscriberFeed.posts

export const selectPost = postID => {
  return createSelector(
    selectPosts,
    posts => posts?.find(post => post.id === postID)
  )
}

export const selectRecentPostsLoading = state => state.subscriberFeed.recentPostsLoading
export const selectNextPostsLoading = state => state.subscriberFeed.nextPostsLoading
export const selectNoMorePosts = state => state.subscriberFeed.noMorePosts
export const selectPostCommentsLoading = state => state.subscriberFeed.postCommentsLoading
export const selectPostNoMoreComments = state => state.subscriberFeed.postNoMoreComments

export const subscriberFeedReducer = subscriberFeedSlice.reducer
