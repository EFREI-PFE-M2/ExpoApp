import { createSlice } from '@reduxjs/toolkit'
import {
  FirebaseAuth as auth,
  FirebaseFirestore as firestore,
} from '../firebase'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    privateConversations: {},
    groupConversations: {},
    searchedUsers: [],
    error: '',
  },
  reducers: {
    updateSearchedUsers: (state, action) => {
      state.searchedUsers = action.payload
    },
    addToPrivate: (state, action) => {
      // Action.payload is a snapshot!
      action.payload?.forEach((element) => {
        state.privateConversations[element.id] = element.data
      })
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addMessagesToConversation: (state, action) => {
      const { conversationID, messageID, message } = action.payload

      state.privateConversations[conversationID].messages[messageID] = message
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

export const searchUsers = (query) => async (dispatch) => {
  let users = []

  const snapshot =
    query.length != 0
      ? await firestore
          .collection('Users')
          .where('displayName', '>=', query)
          .where('displayName', '<=', query + '~')
          .orderBy('displayName')
          .limit(10)
          .get()
          .catch((error) => console.log(error))
      : await firestore
          .collection('Users')
          .orderBy('displayName')
          .limit(10)
          .get()
          .catch((error) => console.log(error))

  snapshot.docs.map((doc) => {
    const user = doc.data()

    users.push({
      uid: doc.id,
      username: user.displayName,
      photoURL: user.photoURL,
    })
  })

  const message = users.length != 0 ? 'OK' : 'No results'
  console.log(message)
  dispatch(updateSearchedUsers(users))
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

export const {
  updateSearchedUsers,
  addToPrivate,
  setError,
  addMessagesToConversation,
} = chatSlice.actions

// thunks
export const getConversationList = (conversationID) => async (dispatch) => {
  try {
    // Snapshot will only contain field
    // const snapshot = await firestore
    //   .collection('PrivateConversation')
    //   .doc(conversationID)
    //   .collection('messages')
    //   .orderBy('createdAt', 'desc')
    //   .limitToLast(10)
    //   .get()
    // snapshot.forEach((data) => console.log(data.id, data.data()))

    const snapshot = await firestore
      .collection('PrivateConversation')
      .doc(conversationID)
      .get()

    dispatch(
      addToPrivate({
        id: snapshot.id,
        data: snapshot.data(),
      })
    )
  } catch (err) {
    console.error(err)
  }
}

export const getConversationFromID = (userID) => async (dispatch) => {
  try {
    const snapshot = await firestore
      .collection('PrivateConversation')
      .where('users', 'array-contains', userID)
      .get()

    let data = []
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, data: doc.data() })
    })
    dispatch(addToPrivate(data))
  } catch (err) {
    console.error(err)
  }
}

export const createConversation = (senderID, receiverID) => async (
  dispatch
) => {
  try {
    const snapshot = await firestore
      .collection('PrivateConversation')
      .where('users', 'array-contains-any', [senderID, receiverID])
      .get()

    if (snapshot.size) return dispatch(setError('Conversation already exists.'))

    let data = {
      senderID,
      receiverID,
      users: [senderID, receiverID],
    }

    // Create new conversation on the database
    const querySnapshot = await firestore
      .collection('PrivateConversation')
      .add(data)

    // Add to local
    dispatch(
      addToPrivate([
        {
          id: querySnapshot.id,
          data,
        },
      ])
    )
  } catch (err) {
    console.error(err)
  }
}

export const startMessagesListening = (conversationID) => async (dispatch) => {
  try {
    const unsubscribe = await firestore
      .collection('PrivateConversation')
      .doc(conversationID)
      .collection('messages')
      .onSnapshot((snapshot) => {
        snapshot.docChanges()?.forEach((change) => {
          if (change.type === 'added') {
            dispatch(
              addMessagesToConversation({
                conversationID,
                messageID: change.doc.id,
                message: change.doc.data(),
              })
            )
          }
        })
      })

    return unsubscribe
  } catch (err) {
    console.error(err)
  }
}

export const sendTextMessage = (conversationID, content) => async (
  dispatch,
  getState
) => {
  const { chat } = getState()
  try {
    if (!content || !conversationID) return

    // Check locally if conversation ID exists
    if (!chat.privateConversations.hasOwnProperty(conversationID))
      return dispatch(setError('Conversation not loaded, error aborting.'))

    await firestore
      .collection('PrivateConversation')
      .doc(conversationID)
      .collection('messages')
      .add({
        type: 'text',
        text: content,
      })
  } catch (err) {
    console.error(err)
  }
}

// selectors
export const selectSearchedUsers = (state) => state.searchedUsers

export const chatReducer = chatSlice.reducer
