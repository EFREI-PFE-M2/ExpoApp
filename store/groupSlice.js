import { createSlice } from '@reduxjs/toolkit'
import firebase, { FirebaseFirestore as firestore } from './../firebase'
import { addUser } from './foreignUserSlice'

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
        state.groups[groupID].users[user.uid] = user
      })
    },
    addPostsToGroup: (state, action) => {
      const { posts, groupID } = action.payload
      posts?.forEach((post) => {
        state.groups[groupID].posts[post.id] = post
      })
    },
    addRequestsToGroup: (state, action) => {
      const { requests, groupID } = action.payload
      requests?.forEach((request) => {
        state.groups[groupID].requests[request.id] = request
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
export const {
  addGroup,
  addAll,
  addUsersToGroup,
  addPostsToGroup,
  addRequestsToGroup,
} = groupSlice.actions

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

    const groupData = groupPromise.map((group) => {
      return {
        id: group.id,
        users: {},
        posts: {},
        requests: {},
        currentUserIsMember: true,
        ...group.data(),
      }
    })

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

export const getMembers = (groupID) => async (dispatch) => {
  if (!groupID) return

  let userArray = []

  try {
    const result = await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupMembers')
      .limit(10)
      .get()

    if (!result.size) return

    result.forEach((doc) => {
      // dispatch(addUser(doc.id, doc.data()))
      userArray.push(doc.data())
    })

    dispatch(addUsersToGroup({ users: userArray, groupID }))
  } catch (err) {
    console.error(err)
  }
}

export const getGroupPosts = (groupID) => async (dispatch) => {
  if (!groupID) return

  let groupPosts = []

  try {
    const result = await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupPosts')
      .limit(10)
      .get()

    if (!result.size) return

    result.forEach((doc) => {
      groupPosts.push({ id: doc.id, ...doc.data() })
    })

    dispatch(addPostsToGroup({ posts: groupPosts, groupID }))
  } catch (err) {
    console.erro(err)
  }
}

export const getPendingRequests = (groupID) => async (dispatch) => {
  if (!groupID) return

  let groupRequests = []

  try {
    const result = await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupJoinPendingRequests')
      .limit(10)
      .get()

    if (!result.size) return

    result.forEach((doc) => {
      groupRequests.push({ id: doc.id, ...doc.data() })
    })

    dispatch(addRequestsToGroup({ requests: groupRequests, groupID }))
  } catch (err) {
    console.error(err)
  }
}

export const acceptRequest = (groupID, requestID) => async (dispatch) => {
  if (!requestID) return

  try {
    const userData = await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupJoinPendingRequests')
      .doc(requestID)
      .get()

    if (userData.exists) {
      await firestore
        .collection('Groups')
        .doc(groupID)
        .collection('GroupMembers')
        .doc(userData.id)
        .set(userData.data())

      await firestore
        .collection('Groups')
        .doc(groupID)
        .collection('GroupJoinPendingRequests')
        .doc(requestID)
        .delete()
    }
  } catch (err) {
    console.error(err)
  }
}

export const refuseRequest = (requestID) => async (dispatch) => {
  if (!requestID) return

  try {
    await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupJoinPendingRequests')
      .doc(requestID)
      .delete()
  } catch (err) {
    console.error(err)
  }
}

export const requestJoinGroup = (userID, groupID) => async (
  dispatch,
  getState
) => {
  if (!groupID || !userID) return
  const { uid, displayName, photoURL } = getState().user

  try {
    const user = await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupMembers')
      .doc(uid)
      .get()

    if (user.exists) throw new Error('User is part of the group.')

    await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupJoinPendingRequests')
      .doc(uid)
      .set({ uid, displayName, photoURL })
  } catch (err) {
    console.error(err)
  }
}

// selectors

export const groupReducer = groupSlice.reducer
