import { createSlice } from '@reduxjs/toolkit'
import firebase, { FirebaseFirestore as firestore } from '../firebase'

export const foreignUserSlice = createSlice({
  name: 'foreignUser',
  initialState: {
    1: {
      users: [],
      username: '',
      winPercentage: 0,
      lossPercentage: 0,
      currentSeries: [],
      level: 0,
      experience: 0,
      nbFollowers: 0,
      nbFollowing: 0,
      posts: [],
      cards: [],
      userBets: {
        1: {
          datetime: new Date().toISOString(),
          betText: 'Default',
          betType: 'simple',
          betCategory: 'gagant',
          bet: [1, 9, 4, 2, 5],
          betRaceID: 1,
          betActionUrl: '',
          betResults: [1, 9, 4, 2, 5],
        },
      },
    },
  },
  reducers: {
    addUser: (state, action) => {
      const { id, data } = action.payload
      state[id] = data
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
export const { addUser } = foreignUserSlice.actions

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
// selectors

export const foreignUserReducer = foreignUserSlice.reducer
