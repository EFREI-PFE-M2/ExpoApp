import { createSlice } from '@reduxjs/toolkit'
import { FirebaseApp as firebase } from '../firebase'

export const raceSlice = createSlice({
  name: 'race',
  initialState: {
    races: [],
    specificRace: '', //done this way because we can view a race page even if it's not in our race list
  },
  reducers: {
    init: (state, action) => {
      state.races = action.payload
    },
  },
})

/*
race object format:
let race = {
    raceID: '',
    locationCode: '',
    location: '',
    raceCode: '',
    raceTitle: '',
    category: '',
    distance: '',
    nbContenders: ''
}
*/

/*
specific race object format:
let specificRace = {
    locationCode: '',
    location: '',
    raceCode: '',
    raceTitle: '',
    category: '',
    distance: '',
    nbContenders: '',
    allocation: '',
    direction: '',
    field: '',
    equidiaPronostic: '',
    betTypesAuthorized: '',
    horses: '',
    results: '',
    posts: []
}
*/

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

//actions imports
const { init } = raceSlice.actions

// thunks
export const getInitRaces = (date) => async (dispatch) => {
  try {
    const getRaces = firebase.functions('europe-west1').httpsCallable('races')
    const result = await getRaces({ date })

    dispatch(init(result.data))
  } catch (err) {
    console.error(err)
  }
}

// selectors

export const raceReducer = raceSlice.reducer
