import { createSlice } from '@reduxjs/toolkit'
import { FirebaseFirestore as firestore } from './../firebase'
import { retrieveUsers } from './foreignUserSlice'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchedUsers: [],
    searchedGroups: [],
  },
  reducers: {
    addToUsers: (state, action) => {
      state.searchedUsers = action.payload
    },
    addToGroups: (state, action) => {
      state.searchedGroups = action.payload
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

/*
searched group object format:
let group = {
    groupID: ''
    name: '',
    picture: ''
}
*/

//actions imports
const { addToGroups, addToUsers } = searchSlice.actions

// thunks
export const searchUsers = (keyword) => async (dispatch, getState) => {
  const { foreignUser } = getState()
  let users = []
  try {
    const result = await firestore
      .collection('Users')
      .where('displayName', '==', keyword)
      .get()

    if (!result.size) return

    result.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() })
    })
  } catch (err) {
    console.log(err)
  }

  // const filtered = users.filter((id) => !Object.keys(foreignUser).includes(id))

  // await dispatch(retrieveUsers(filtered))
  await dispatch(addToUsers(users))
}

// selectors
export const selectUserResults = ({ search }) => search.searchedUsers

export const searchReducer = searchSlice.reducer
