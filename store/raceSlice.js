import { createSlice } from '@reduxjs/toolkit'
import { FirebaseApp as firebase } from '../firebase'
import { FirebaseFirestore as firestore } from '../firebase'
import uploadImage from '../utils/uploadImage'

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
    specificRaceNoMorePosts: false
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
      post.id === postID ? {...post, alreadyLiked: like} : post)
    },
  },
})

//actions imports
export const { setRaces, setSpecificRace, setSpecificRacePosts, addSpecificRacePostToMostRecent,
  setSpecificRaceRecentPostsLoading, setSpecificRaceNextPostsLoading,
  setSpecificRaceNoMorePosts, addSpecificRacePosts, setSpecificRacePostLikeStatus} = raceSlice.actions

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
  /*
  feed, entityID, postID, userID, unlike
  const likePost = firebase.functions('europe-west1').httpsCallable('likePost')
  const result = await likePost({feed: 'race', entityID: 56, postID: 12, unlike: false})
  console.log(result)
  */
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
      snapshot.forEach(doc => {
        let post = doc.data()
        delete post.createdAt
        post.id = doc.id
        posts.push(post)
      });

      dispatch(addSpecificRacePosts(posts))

      //hide loading indicator
      dispatch(setSpecificRaceNextPostsLoading(false))
  } catch (err) {
    console.error(err)
  }
}

export const newRacePost = (data, cbSuccess, cbError) => async (dispatch) => {
  
  try{
    let {user, text, image, survey, bet, raceID} = data;
    
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


    await firestore.collection(`Races/${raceID}/Posts`).add(post)//insert in firestore

    dispatch(addSpecificRacePostToMostRecent([post]))//add to local store

    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}


export const likePost = (data, cbSuccess, cbError) => async (dispatch) => {
  
  try{
    let { postID, like, raceID, userID } = data
    
    const likePostCloudFunction = firebase.functions('europe-west1').httpsCallable('likePost')
    const res = await likePostCloudFunction({feed: 'race', entityID: raceID,
       postID: postID, userID: userID, like: like})
    
       console.log(res)




    //set local store
    dispatch(setSpecificRacePostLikeStatus({postID: postID, like: like}))
    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}

// selectors
export const selectRaces = state => state.race.races
export const selectSpecificRace = state => state.race.specificRace
export const selectSpecificRaceRecentPostsLoading = state => state.race.specificRaceRecentPostsLoading
export const selectSpecificRaceNextPostsLoading = state => state.race.specificRaceNextPostsLoading
export const selectSpecificRaceNoMorePosts = state => state.race.specificRaceNoMorePosts

export const raceReducer = raceSlice.reducer
