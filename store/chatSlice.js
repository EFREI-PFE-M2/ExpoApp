import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    privateConversations: [],
    groupConversations: [],
    searchedUsers: [],
  },
  reducers: {},
})

/*
searched user object format:
let user = {
  userID: '',
  username: '',
  profilePicture: '',
}
*/

/*
privateConversation object format:
let privateConversation = {
  interlocutorID
  interlocutorUsername
  interlocutorProfilePicture
  messages: []
}
*/

/*
privateConversation object format:
let groupConversation = {
  groupName: ''
  groupPicture: '',
  groupID: '',
  messages: []
}
*/

/*
message object format:
let message = {
  type: '',
  datetime: '',
  username: '',
  profilePicture: '',
  userID: '',
  ---
  text: '',
  ---
  imageCaption: '',
  image: '',
  ---
  audio: ''
}
*/

//actions imports

// thunks

// selectors

export const chatReducer = chatSlice.reducer
