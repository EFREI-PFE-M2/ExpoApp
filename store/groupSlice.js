import { createSlice } from '@reduxjs/toolkit'
import firebase, { FirebaseFirestore as firestore } from './../firebase'

export const groupSlice = createSlice({
  name: 'group',
  initialState: {
    groups: {},
    specificGroup: {}, //done this way because we can view a group page even if it's not in our group list
  },
  reducers: {
    addGroup: (state, action) => {
      const { id, data } = action.payload
      state.groups[id] = data
    },
    addAll: (state, action) => {
      action.payload?.forEach((obj) => {
        const { id, ...rest } = obj
        state.groups[id] = rest
      })
    },
    addUsersToGroup: (state, action) => {
      const { users, groupID } = action.payload
      users?.forEach((user) => {
        state.groups[groupID].users[user.id] = user
      })
    },
  },
})

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
export const { addGroup, addAll, addUsersToGroup } = groupSlice.actions

// thunks
export const getGroup = (groupID) => async (dispatch) => {
  try {
    const result = await firestore.collection('Groups').doc(groupID).get()

    dispatch(addGroup({ id: result.id, data: result.data() }))
  } catch (err) {
    console.error(err)
  }
}

export const getUserGroup = (userID) => async (dispatch) => {
  let groups = []
  try {
    const result = await firestore
      .collectionGroup('GroupMembers')
      .where('uid', '==', userID)
      .get()

    result.forEach(async (doc) => {
      const groupDoc = doc.ref.parent.parent
      groups.push(groupDoc.id)
    })

    const groupPromise = await Promise.all(
      groups.map((groupID) => firestore.collection('Groups').doc(groupID).get())
    )

    const groupData = groupPromise.map((group) => group.data())

    await dispatch(addAll(groupData))
  } catch (err) {
    console.error(err)
  }
}

export const createGroup = (name, isPrivate, photo) => async (
  dispatch,
  getState
) => {
  if (!name) return
  const { user } = getState()
  try {
    const result = await firestore.collection('Groups').add({
      name,
      private: isPrivate,
      nbMembers: 1,
      masterID: user?.uid,
    })

    const data = await result.get()

    await dispatch(addGroup({ id: result.id, data: data.data() }))
    return result.id
  } catch (err) {
    console.error(err)
  }
  return null
}

// selectors

export const groupReducer = groupSlice.reducer
