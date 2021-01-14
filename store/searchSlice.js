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
    resetUsers: (state) => {
      state.searchedUsers = []
    },
    resetGroups: (state) => {
      state.searchedGroups = []
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
export const {
  addToGroups,
  addToUsers,
  resetGroups,
  resetUsers,
} = searchSlice.actions

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

export const searchGroups = (keyword) => async (dispatch) => {
  let groups = []
  try {
    const result = await firestore
      .collection('Groups')
      .where('name', '==', keyword)
      .get()

    if (!result.size) return

    result.forEach((doc) => {
      groups.push({ id: doc.id, ...doc.data() })
    })
  } catch (err) {
    console.log(err)
  }

  await dispatch(addToGroups(groups))
}

// selectors
export const selectUserResults = ({ search }) => search.searchedUsers
export const selectGroupResults = ({ search }) => search.searchedGroups

export const searchReducer = searchSlice.reducer
