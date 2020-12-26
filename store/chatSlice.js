import { createSlice } from '@reduxjs/toolkit'
import {
  FirebaseAuth as auth,
  FirebaseFirestore as firestore,
} from '../firebase'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    privateConversations: [],
    groupConversations: [],
    searchedUsers: [],
  },
  reducers: {
    updateSearchedUsers: (state, action) => {
      state.searchedUsers = action.payload
    },
  },
})

/*
searched user object format:
let user = {
  userID: '',
  username: '',
  profilePicture: '',
}
*/

export const retrieveAllUsers = () => async (dispatch) => {
  try {
    let users = []
    const snapshot = await firestore.collection('Users').get()
    snapshot.docs.map((doc) => {
      const u = doc.data()
      const user = {}
      user.userID = u.uid
      user.username = u.displayName
      user.photoURL = u.photoURL
      users.push(user)
    })
    dispatch(updateSearchedUsers(users))
  } catch (err) {
    console.error(err)
  }
}

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

export const { updateSearchedUsers } = chatSlice.actions

// thunks

// selectors
export const selectSearchedUsers = (state) => state.searchedUsers

export const chatReducer = chatSlice.reducer
