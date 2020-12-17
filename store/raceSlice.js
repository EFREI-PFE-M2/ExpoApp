import { createSlice } from '@reduxjs/toolkit'

export const raceSlice = createSlice({
  name: 'race',
  initialState: {
    races: [],
    specificRace: {}, //done this way because we can view a race page even if it's not in our race list
  },
  reducers: {},
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

// thunks

// selectors

export const raceReducer = raceSlice.reducer
