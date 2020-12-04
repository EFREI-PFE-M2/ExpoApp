import { createSlice } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchedUsers: [],
    searchedGroups: [],
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
searched group object format:
let group = {
    groupID: ''
    name: '',
    picture: ''
}
*/

//actions imports

// thunks

// selectors

export const searchReducer = searchSlice.reducer
