import { createSlice } from '@reduxjs/toolkit'

export const raceSlice = createSlice({
  name: 'race',
  initialState: {
    races: [
      {
        id: 1,
        locationCode: '1',
        location: 'Feurs',
        raceCode: 'R3 C1',
        raceTitle: 'Prix Citeos',
        category: 'Plat',
        distance: 400,
        nbContenders: 9,
        allocation: 18000,
        direction: 'Droite',
        field: 'Herbe',
        equidiaPronostic: [1, 6, 8, 3, 5],
        betTypesAuthorized: ['simple', 'couple', 'quinte'],
        horses: {
          1: 'Horse 1',
          2: 'Horse 2',
          3: 'Horse 3',
          4: 'Horse 4',
          5: 'Horse 5',
          6: 'Horse 6',
          7: 'Horse 7',
          8: 'Horse 8',
          9: 'Horse 9',
        },
        results: [1, 9, 4, 2, 5],
      },
    ],
    specificRace: '', //done this way because we can view a race page even if it's not in our race list
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
