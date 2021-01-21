import { createSlice } from '@reduxjs/toolkit'
import { exp } from 'react-native-reanimated'
import {
  FirebaseAuth as auth,
  FirebaseFirestore as firestore,
} from '../firebase'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    privateConversations: {},
    groupConversations: {},
    usersToSearch: [],
    usersToAdd: [],
    error: '',
  },
  reducers: {
    updateMessages: (state, action) => {
      state.messages = action.payload
    },
    updateUsersToSearch: (state, action) => {
      state.usersToSearch = action.payload
    },
    updateUsersToAdd: (state, action) => {
      state.usersToAdd = action.payload
    },
    addToPrivate: (state, action) => {
      // Action.payload is a snapshot!
      let updatedPrivateConversations = Object.entries(
        state.privateConversations
      )

      action.payload?.forEach((element) => {
        updatedPrivateConversations.unshift([
          element.id,
          { ...element.data, messages: {} },
        ])
        //state.privateConversations[element.id] = element.data
        //state.privateConversations[element.id].messages = {}
      })

      state.privateConversations = updatedPrivateConversations.reduce(
        (r, [k, v]) => ({ ...r, [k]: v }),
        {}
      )
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
      photoURL:
        user.photoURL != undefined
          ? user.photoURL
          : 'https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg',
    })
  })

  await dispatch(updateUsersToSearch(users))
}

// test for one user
export const selectUsers = (uid) => async (dispatch, getState) => {
  const { chat } = getState()

  let users = []
  if (typeof uid == 'string') users.push(uid)

  await dispatch(updateUsersToAdd(users))
}

export const getMessagesFromPrivateConversation = (
  conversationID,
  earliestMessageID = undefined
) => async (dispatch, getState) => {
  const { chat } = getState()

  let messages = []

  const sp =
    typeof earliestMessageID == 'string'
      ? await firestore
          .collection('PrivateConversation')
          .doc(conversationID)
          .collection('Messages')
          .doc(earliestMessageID)
          .get()
      : undefined

  const snapshot =
    typeof earliestMessageID == 'undefined'
      ? // 10 most recent messages in the chat
        await firestore
          .collection('PrivateConversation')
          .doc(conversationID)
          .collection('Messages')
          .orderBy('createdAt')
          .limitToLast(10)
          .get()
      : // <= 10 older messages than the referenced message
        await firestore
          .collection('PrivateConversation')
          .doc(conversationID)
          .collection('Messages')
          .where('createdAt', '<', sp.data().createdAt)
          .orderBy('createdAt', 'desc')
          .limitToLast(10)
          .get()

  if (typeof earliestMessageID == 'undefined') {
    snapshot.docs.map((doc) => {
      const message = doc.data()
      messages.push({
        messageID: doc.id,
        ...message,
      })
    })
  } else {
    snapshot.docs.map((doc) => {
      const message = doc.data()
      messages.unshift({
        messageID: doc.id,
        ...message,
      })
    })

    if (messages[0].messageID == chat.messages[0].messageID) return
    else messages = [...messages, ...chat.messages]
  }

  await dispatch(updateMessages(messages))
}

//actions imports
export const {
  updateMessages,
  updateUsersToSearch,
  updateUsersToAdd,
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
      .orderBy('createdAt', 'desc')
      .get()

    let data = []

    let count = snapshot.size

    snapshot.forEach(async (doc) => {
      const lastMessage = await firestore
        .collection('PrivateConversation')
        .doc(doc.id)
        .collection('Messages')
        .orderBy('createdAt')
        .limitToLast(1)
        .get()

      if (lastMessage.size) {
        lastMessage.docs.forEach((_doc) => {
          const lastMessage = _doc.data()
          data.push({ id: doc.id, data: { ...doc.data(), lastMessage } })
        })
      } else {
        data.push({ id: doc.id, data: { ...doc.data(), lastMessage: {} } })
      }

      count--
      if (count == 0) {
        let sortedData = data.sort((a, b) => {
          if (a.lastMessage && b.lastMessage) {
            return a.lastMessage.createdAt - b.lastMessage.createdAt
          } else {
            if (b.lastMessage) {
              return a.createdAt - b.lastMessage.createdAt
            } else if (a.lastMessage) {
              return a.lastMessage.createdAt - b.createdAt
            } else {
              return a.createdAt - b.createdAt
            }
          }
        })

        dispatch(addToPrivate(sortedData))
      }
    })
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
      .where('users', 'array-contains', senderID)
      .get()

    let array = [...snapshot.docs]
    array = array.filter((doc) => {
      const chat = doc.data()
      const conditionFirst = chat.senderID == receiverID
      const conditionSecond = chat.receiverID == receiverID
      if (conditionFirst || conditionSecond) return true
      else return false
    })

    if (array.length != 0)
      return dispatch(setError('Conversation already exists.'))
    else {
      const senderDoc = await firestore.collection('Users').doc(senderID).get()
      const sender = senderDoc.data()
      const receiverDoc = await firestore
        .collection('Users')
        .doc(receiverID)
        .get()
      const receiver = receiverDoc.data()

      let data = {
        senderID,
        senderDisplayName: sender.displayName,
        senderPhotoURL:
          sender.photoURL != undefined
            ? sender.photoURL
            : 'https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg',
        receiverID,
        receiverDisplayName: receiver.displayName,
        receiverPhotoURL:
          receiver.photoURL != undefined
            ? receiver.photoURL
            : 'https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg',
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
            data: { ...data, createdAt: new Date(), lastMessage: {} },
          },
        ])
      )
    }
  } catch (err) {
    console.error(err)
  }
}

export const startMessagesListening = (conversationID) => async (dispatch) => {
  try {
    const unsubscribe = await firestore
      .collection('PrivateConversation')
      .doc(conversationID)
      .collection('Messages')
      .onSnapshot((snapshot) => {
        snapshot.docChanges()?.forEach(async (change) => {
          if (change.type === 'added') {
            await dispatch(
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

export const sendChatMessage = (conversationID, message) => async (
  dispatch,
  getState
) => {
  const { chat } = getState()
  try {
    if (!message || !conversationID) return

    // Check locally if conversation ID exists
    if (!chat.privateConversations.hasOwnProperty(conversationID))
      return dispatch(setError('Conversation not loaded, error aborting.'))

    await firestore
      .collection('PrivateConversation')
      .doc(conversationID)
      .collection('Messages')
      .add(message)

    dispatch(updateMessages([...chat.messages, message]))
  } catch (err) {
    console.error(err)
  }
}

// selectors
export const selectMessages = (state) => state.chat.messages
export const selectPrivateChats = (state) => state.chat.privateConversations
export const selectUsersToSearch = (state) => state.chat.usersToSearch
export const selectUsersToAdd = (state) => state.chat.usersToAdd
export const selectError = (state) => state.chat.error

export const chatReducer = chatSlice.reducer
