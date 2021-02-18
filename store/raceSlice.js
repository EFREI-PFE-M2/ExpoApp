import { createSlice } from '@reduxjs/toolkit'
import { FirebaseApp as firebase } from '../firebase'
import { FirebaseFirestore as firestore } from '../firebase'
import uploadImage from '../utils/uploadImage'
import { createSelector } from 'reselect'

const PAGINATION = 3

export const raceSlice = createSlice({
  name: 'race',
  initialState: {
    races: [],
    racesLoading: false,
    specificRace: '', //done this way because we can view a race page even if it's not in our race list,
    specificRaceLoading: false,
    specificRaceRecentPostsLoading: false,
    specificRaceNextPostsLoading: false,
    specificRaceNoMorePosts: false,
    specificRacePostCommentsLoading: false,
    specificRacePostNoMoreComments: false
  },
  reducers: {
    setRaces: (state, action) => {
      state.races = action.payload
    },
    setSpecificRace: (state, action) => {
      state.specificRace = action.payload
    },
    setSpecificRacePosts: (state, action) => {
      state.specificRace.posts = action.payload
    },
    addSpecificRacePostToMostRecent: (state, action) => {
      if(state.specificRace.posts)
        state.specificRace.posts =  [...action.payload, ...state.specificRace.posts]
      else
        state.specificRace.posts =  action.payload
    },
    addSpecificRacePosts: (state, action) => {
      if(state.specificRace.posts)
        state.specificRace.posts =  [...state.specificRace.posts, ...action.payload]
      else
        state.specificRace.posts =  action.payload
    },
    setSpecificRaceRecentPostsLoading: (state, action) => {
      state.specificRaceRecentPostsLoading = action.payload
    },
    setSpecificRaceNextPostsLoading: (state, action) => {
      state.specificRaceNextPostsLoading = action.payload
    },
    setSpecificRaceNoMorePosts: (state, action) => {
      state.specificRaceNoMorePosts = action.payload
    },
    setSpecificRacePostLikeStatus: (state, action) => {
      let { postID, like } = action.payload
      state.specificRace.posts = state.specificRace.posts.map((post)=>
      post.id === postID ? {...post, alreadyLiked: like, nbLikes: like ? post.nbLikes+1 : post.nbLikes-1} : post)
    },
    setSpecificRacePostVoteStatus: (state, action) => {
      let { postID, response } = action.payload
      state.specificRace.posts = state.specificRace.posts.map((post)=>
      post.id === postID ? {...post, userVote: response, responses: {...post.responses, [response]: post.responses[response] + 1}} : post)
    },
    setSpecificRacePostVoteComments: (state, action) => {
      let { comments, postID } = action.payload
      state.specificRace.posts = state.specificRace.posts.map((post)=>
      post.id === postID ? {...post, comments: comments} : post)
    },
    setSpecificRacePostCommentsLoading: (state, action) => {
      state.specificRacePostCommentsLoading = action.payload
    },
    setSpecificRacePostNoMoreComments: (state, action) => {
      state.specificRacePostNoMoreComments = action.payload
    },
    addSpecificRacePostComment: (state, action) => {
      let { comment, postID } = action.payload
      state.specificRace.posts = state.specificRace.posts.map((post)=>
      post.id === postID ? {...post, nbComments: post.nbComments + 1, comments: [...post?.comments, comment]} : post)
    },
  },
})

//actions imports
export const { setRaces, setSpecificRace, setSpecificRacePosts, addSpecificRacePostToMostRecent,
  setSpecificRaceRecentPostsLoading, setSpecificRaceNextPostsLoading,
  setSpecificRaceNoMorePosts, addSpecificRacePosts, setSpecificRacePostLikeStatus,
  setSpecificRacePostVoteStatus, setSpecificRacePostVoteComments, setSpecificRacePostCommentsLoading,
  setSpecificRacePostNoMoreComments, addSpecificRacePostComment} = raceSlice.actions

// thunks
export const updateRaces = (date) => async (dispatch) => {
  try {
    const getRacesFunction = firebase.functions('europe-west1').httpsCallable('races')
    date = date.toDateString()
    const result = await getRacesFunction({date})

    dispatch(setRaces(result.data))
  } catch (err) {
    console.error(err)
  }
}

export const updateSpecificRaceRecentPosts = (raceID) => async (dispatch, getState) => {
  try {

    let userID = getState().user.uid

    dispatch(setSpecificRacePosts([]))
    dispatch(setSpecificRaceNoMorePosts(false))
    dispatch(setSpecificRaceRecentPostsLoading(true))
    
    //make query
    const snapshot  = await firestore
      .collection(`Races/${raceID}/Posts`)
      .orderBy('datetime','desc')
      .limit(PAGINATION)
      .get();

      if (snapshot.empty) {
        console.log('No matching document');
        dispatch(setSpecificRaceRecentPostsLoading(false))
        dispatch(setSpecificRaceNoMorePosts(true))
        return;
      } 
      let posts = []

      for(doc of snapshot.docs) {
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
      
      dispatch(setSpecificRacePosts(posts))
      
      //hide loading indicator
      dispatch(setSpecificRaceRecentPostsLoading(false))
  } catch (err) {
    alert('Erreur interne')
    console.error(err)
    dispatch(setSpecificRaceRecentPostsLoading(false))
  }
}

export const addSpecificRaceNextPosts = (raceID) => async (dispatch, getState) => {
  try {
    
    let currentPosts = getState().race.specificRace.posts;
    let userID = getState().user.uid

    if(currentPosts.length < 1)
      return;

    let lastPost = currentPosts[currentPosts.length-1];

    dispatch(setSpecificRaceNextPostsLoading(true))

    const snapshot  = await firestore
      .collection(`Races/${raceID}/Posts`)
      .orderBy('datetime','desc')
      .startAfter(lastPost.datetime)
      .limit(PAGINATION)
      .get();

      if (snapshot.empty) {
        dispatch(setSpecificRaceNextPostsLoading(false))
        dispatch(setSpecificRaceNoMorePosts(true))
        console.log('No matching documents.');
        return;
      } 

      let posts = []
      for(doc of snapshot.docs) {
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

      dispatch(addSpecificRacePosts(posts))

      //hide loading indicator
      dispatch(setSpecificRaceNextPostsLoading(false))
  } catch (err) {
    console.error(err)
  }
}

export const newRacePost = (data, cbSuccess, cbError) => async (dispatch) => {
  
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


    await firestore.collection(`Races/${entityID}/Posts`).add(post)//insert in firestore

    dispatch(addSpecificRacePostToMostRecent([post]))//add to local store

    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}


export const likePost = (data, cbSuccess, cbError) => async (dispatch) => {
  
  try{
    let { postID, like, raceID, userID, postOwnerID } = data
    
    const likePostCloudFunction = firebase.functions('europe-west1').httpsCallable('likePost')
    await likePostCloudFunction({feed: 'race', entityID: raceID,
       postID: postID, userID: userID, like: like, postOwnerID: postOwnerID})
    
    //set local store
    dispatch(setSpecificRacePostLikeStatus({postID: postID, like: like}))
    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}


export const vote = (data, cbSuccess, cbError) => async (dispatch) => {
  
  try{
    let { postID, raceID, userID, response } = data
    
    const voteCloudFunction = firebase.functions('europe-west1').httpsCallable('vote')
    await voteCloudFunction({feed: 'race', entityID: raceID,
       postID: postID, userID: userID, response: response})
    
    //set local store
    dispatch(setSpecificRacePostVoteStatus({postID: postID, response: response}))
    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}


export const updateSpecificRacePostComments = (data) => async (dispatch) => {
  try {

    let { raceID, postID } = data


    dispatch(setSpecificRacePostVoteComments({comments: [], postID: postID}))
    dispatch(setSpecificRacePostNoMoreComments(false))
    dispatch(setSpecificRacePostCommentsLoading(true))
    
    //make query
    const snapshot  = await firestore
      .collection(`Races/${raceID}/Posts/${postID}/Comments`)
      .orderBy('datetime','asc')
      .get();

      if (snapshot.empty) {
        console.log('No matching document');
        dispatch(setSpecificRacePostCommentsLoading(false))
        dispatch(setSpecificRacePostNoMoreComments(true))
        return;
      } 
      let comments = []

      for(doc of snapshot.docs) {
        let comment = doc.data()
        delete comment.createdAt

        comments.push(comment)
      } 
      
      dispatch(setSpecificRacePostVoteComments({comments: comments, postID: postID}))
      
      //hide loading indicator
      dispatch(setSpecificRacePostCommentsLoading(false))
  } catch (err) {
    alert('Erreur interne')
    console.error(err)
    dispatch(setSpecificRacePostCommentsLoading(false))
  }
}


export const comment = (data, cbSuccess, cbError) => async (dispatch, getState) => {
  let currentDate = new Date()
  let currentUser = getState().user
  try{
    let { raceID, postID, text, postOwnerID } = data

    let comment = {
      datetime: currentDate.toISOString(), 
      displayName: currentUser.displayName, 
      picture: currentUser.photoURL, 
      userID: currentUser.uid, 
      text: text
    }
    
    const commentCloudFunction = firebase.functions('europe-west1').httpsCallable('comment')
    await commentCloudFunction({feed: 'race', entityID: raceID, postID: postID, userID: currentUser.uid, datetime: currentDate.toISOString(), 
      displayName: currentUser.displayName, picture: currentUser.photoURL, text: text, postOwnerID: postOwnerID})
    
    //set local store
    dispatch(addSpecificRacePostComment({comment: comment, postID: postID}))
    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}

// selectors
export const selectRaces = state => state.race.races
export const selectSpecificRace = state => state.race.specificRace

export const selectSpecificRacePost = postID => {
  return createSelector(
    selectSpecificRace,
    specificRace => specificRace.posts?.find(post => post.id === postID)
  )
}
export const selectSpecificRaceRecentPostsLoading = state => state.race.specificRaceRecentPostsLoading
export const selectSpecificRaceNextPostsLoading = state => state.race.specificRaceNextPostsLoading
export const selectSpecificRaceNoMorePosts = state => state.race.specificRaceNoMorePosts
export const selectSpecificRacePostCommentsLoading = state => state.race.specificRacePostCommentsLoading
export const selectSpecificRacePostNoMoreComments = state => state.race.specificRacePostNoMoreComments

export const raceReducer = raceSlice.reducer
