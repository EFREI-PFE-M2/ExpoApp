import { createSlice } from '@reduxjs/toolkit';

export const groupSlice = createSlice({
  name: 'group',
  initialState: {
    groups: [],
    specificGroup: {} //done this way because we can view a group page even if it's not in our group list
  },
  reducers: {},
});

/*
group object format:
let group = {
    groupID: ''
    name: '',
    picture: '',
    lastPostDatetime: ''
}
*/

/*
specificGroup object format:
let specificGroup = {
    name: '',
    masterID: '',
    private: false,
    nbMembers: 0,
    creationDate: '',
    picture: '',
    members: [],
    joinPendingRequests: [],
    posts: [],
}
*/


/*
member object format:
let member = {
  username: '',
  userID: '',
  profilePicture: '',
}
*/

/*
joinPendingRequest object format:
let joinPendingRequest = {
  username: '',
  userID: '',
  profilePicture: '',
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


export default groupSlice.reducer;