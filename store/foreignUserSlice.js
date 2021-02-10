import { createSlice } from '@reduxjs/toolkit'
import firebase, { FirebaseFirestore as firestore } from '../firebase'

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
export const { addUser, setUser } = foreignUserSlice.actions

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


// selectors
export const selectForeignUser = (state) => state.foreignUser
export const foreignUserReducer = foreignUserSlice.reducer
