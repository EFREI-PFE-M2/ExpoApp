import { createSlice } from '@reduxjs/toolkit'
import { FirebaseApp as firebase } from '../firebase'
import { FirebaseFirestore as firestore } from '../firebase'
import uploadImage from '../utils/uploadImage'
import { createSelector } from 'reselect'

const PAGINATION = 3

export const foreignUserSlice = createSlice({
  name: 'foreignUser',
  initialState: {
    
  },
  reducers: {
    addUser: (state, action) => {
      const { id, data } = action.payload
      state[id] = data
    },
    setUser: (state, action) => {
      state = Object.assign(state, action.payload)
    },
    followUser: (state, action) => {
      const { follow, followedID } = action.payload

      if(state.id === followedID){
        state = Object.assign(state, {isFollowed: follow, nbFollowers: follow ? state.nbFollowers + 1 : state.nbFollowers - 1})
      }

    },
  },
})

/*
post object format:
let post ={
    type '',
    nbLikes '',
    nbComments '',
    datetime '',
    username '',
    profilePicture '',
    userID '',
    ===
    location: '',
    ---
    text: '',
    ---
    imageCaption: '',
    image: '',
    ---
    nbCopiedBets: 0,
    bet : {},
    ---
    question: '',
    responses: new Map(),
    expirationDatetime: ''
    comments: []
}
*/

/*
comment object format:
let comment ={
  username: '',
  userID: '',
  profilePicture: '',
  datetime: '',
  text: ''
}
*/

/*
bet object format:
let bet ={
  datetime: '',
  betText: '',
  betType: '',
  betCategory: '',
  bet: [],
  betRaceID: '',
  betActionUrl: '',
  betResults: [],
}
*/

/*
card object format:
let card ={
  name: '',
  description: '',
  rarity: 0,
  picture: ''
  caracteristics: new Map()
}
*/

//actions imports
export const { addUser, setUser, followUser } = foreignUserSlice.actions

// thunks
export const retrieveUsers = (ids) => async (dispatch) => {
  if (!ids?.length) return
  try {
    const results = await Promise.all([
      ids.map((id) => firestore.collection('Users').doc(id).get()),
    ])

    results.forEach((doc) => console.log(doc))

    if (!results.size) return

    results.forEach((doc) => {
      dispatch(addUser({ id: doc.id, data: doc.data() }))
    })
  } catch (err) {
    console.log(err)
  }
}

export const updateForeignUser = (id) => async (dispatch, getState) => {
  try {
    const { user } = getState()
    let userRef = firestore.collection('Users').doc(id)
    let doc = await userRef.get()
    if (!doc.exists) {
      console.log('No user found with this id');
      return;
    }

    let foreignUser = doc.data()
    foreignUser.id = doc.id
    delete foreignUser.createdAt

    //check if followed
    const snapshot = await firestore.collection('Follows').where('followerID', '==', user.uid ).where('followedID','==', id).get();
    if (!snapshot.empty) {
      foreignUser.isFollowed = true;
    }  

    dispatch(setUser(foreignUser))

  } catch (err) {
    console.log(err)
  }
}


export const follow = (data) => async (dispatch, getState) => {
  let {followedID, follow} = data
  try {
    const { user } = getState()


    const followCloudFunction = firebase.functions('europe-west1').httpsCallable('follow')
    await followCloudFunction({followerID: user.uid, followedID: followedID, follow: follow})

    dispatch(followUser({followedID: followedID, follow: follow}))
    

  } catch (err) {
    console.log(err)
  }
}


// selectors
export const selectForeignUser = (state) => state.foreignUser
export const foreignUserReducer = foreignUserSlice.reducer
