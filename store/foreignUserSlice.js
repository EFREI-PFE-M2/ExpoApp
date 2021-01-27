import { createSlice } from '@reduxjs/toolkit'

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
  reducers: {},
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

// thunks

// selectors

export const foreignUserReducer = foreignUserSlice.reducer
