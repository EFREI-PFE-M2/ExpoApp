import { createSlice } from '@reduxjs/toolkit'
import { FirebaseFirestore as firestore } from '../firebase'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    privateConversations: {},
    groupChatInfo: {},
    groupConversations: {},
    usersToSearch: [],
    usersToAdd: {},
    error: '',
  },
  reducers: {
    updateUsersToSearch: (state, action) => {
      state.usersToSearch = action.payload
    },
    updateUsersToAdd: (state, action) => {
      state.usersToAdd = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    updateGroupChatMembersList: (state, action) => {
      const { conversationID, data } = action.payload
      state.groupConversations[conversationID].users = data.users
      state.groupConversations[conversationID].usersDetails = data.usersDetails
    },
    updateGroupConversationsAfterLeaving: (state, action) => {
      const { conversationID } = action.payload
      delete state.groupConversations[conversationID]
    },
    updateGroupChatMembersDetails: (state, action) => {
      const { conversationID, usersDetails } = action.payload
      state.groupConversations[conversationID].usersDetails = usersDetails
    },
    updateGroupChatInfo: (state, action) => {
      state.groupChatInfo = action.payload
    },
    setReachFirstMessageState: (state, action) => {
      const {
        conversationID,
        isPrivateChat,
        reachFirstMessageState,
      } = action.payload

      if (isPrivateChat)
        state.privateConversations[
          conversationID
        ].reachFirstMessageState = reachFirstMessageState
      else
        state.groupConversations[
          conversationID
        ].reachFirstMessageState = reachFirstMessageState
    },
    putAtTopLastUpToDatePrivateChat: (state, action) => {
      const referencedID = action.payload.id
      const lastMessage = action.payload.lastMessage
      state.privateConversations[referencedID].lastMessage = lastMessage

      let privateChatToTop = Object.assign(
        {},
        { [referencedID]: state.privateConversations[referencedID] }
      )

      privateChatToTop = Object.entries(privateChatToTop)

      let privateConversations = Object.assign({}, state.privateConversations)

      delete privateConversations[referencedID]

      let updatedPrivateConversations = Object.entries(privateConversations)

      updatedPrivateConversations.unshift(...privateChatToTop)

      state.privateConversations = updatedPrivateConversations.reduce(
        (r, [k, v]) => ({ ...r, [k]: v }),
        {}
      )
    },
    putAtTopLastUpToDateGroupChat: (state, action) => {
      const referencedID = action.payload.id
      const lastMessage = action.payload.lastMessage
      state.groupConversations[referencedID].lastMessage = lastMessage

      let groupChatToTop = Object.assign(
        {},
        { [referencedID]: state.groupConversations[referencedID] }
      )

      groupChatToTop = Object.entries(groupChatToTop)

      let groupConversations = Object.assign({}, state.groupConversations)

      delete groupConversations[referencedID]

      let updatedGroupConversations = Object.entries(groupConversations)

      updatedGroupConversations.unshift(...groupChatToTop)

      state.groupConversations = updatedGroupConversations.reduce(
        (r, [k, v]) => ({ ...r, [k]: v }),
        {}
      )
    },
    addToPrivate: (state, action) => {
      // Action.payload is a snapshot!
      let updatedPrivateConversations = Object.entries(
        state.privateConversations
      )

      action.payload?.forEach((element) => {
        updatedPrivateConversations.unshift([
          element.id,
          { ...element.data, messages: [], reachFirstMessageState: false },
        ])
      })

      state.privateConversations = updatedPrivateConversations.reduce(
        (r, [k, v]) => ({ ...r, [k]: v }),
        {}
      )
    },
    addToGroup: (state, action) => {
      // Action.payload is a snapshot!
      let updatedGroupConversations = Object.entries(state.groupConversations)

      action.payload?.forEach((element) => {
        updatedGroupConversations.unshift([
          element.id,
          { ...element.data, messages: [], reachFirstMessageState: false },
        ])
      })

      state.groupConversations = updatedGroupConversations.reduce(
        (r, [k, v]) => ({ ...r, [k]: v }),
        {}
      )
    },
    addMessagesToPrivateConversation: (state, action) => {
      const { conversationID, messages } = action.payload

      state.privateConversations[conversationID].messages = messages
    },
    addMessagesToGroupConversation: (state, action) => {
      const { conversationID, messages } = action.payload

      state.groupConversations[conversationID].messages = messages
    },
  },
})

/**
 * @param {Object} groupChatInfo
 */
export const changeGroupChatInfo = (groupChatInfo) => async (dispatch) => {
  try {
    if (typeof groupChatInfo == 'object')
      return dispatch(updateGroupChatInfo(groupChatInfo))
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {String} query
 * @param {Array<String>} alreadyInvitedUsers
 */
export const searchUsers = (query, groupConversationID = undefined) => async (
  dispatch,
  getState
) => {
  try {
    const { user } = getState()
    const currentUser = user.uid
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
        : await firestore
            .collection('Users')
            .orderBy('displayName')
            .limit(10)
            .get()

    let alreadyInvitedUsers = []

    const sp = groupConversationID
      ? await firestore
          .collection('GroupConversation')
          .doc(groupConversationID)
          .get()
          .then((doc) => (alreadyInvitedUsers = doc.data().users))
      : null

    snapshot.docs.map((doc) => {
      const user = doc.data()
      if (currentUser != doc.id) {
        if (
          !groupConversationID ||
          (alreadyInvitedUsers.length && !alreadyInvitedUsers.includes(doc.id))
        )
          users.push({
            uid: doc.id,
            username: user.displayName,
            photoURL:
              user.photoURL != undefined
                ? user.photoURL
                : 'https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg',
          })
      }
    })

    await dispatch(updateUsersToSearch(users))
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {Object} aUsers
 */
export const selectUsers = (aUsers = undefined) => async (dispatch) => {
  try {
    if (!aUsers) return dispatch(updateUsersToAdd({}))
    if (typeof aUsers == 'object') return dispatch(updateUsersToAdd(aUsers))
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {String} conversationID
 * @param {String} earliestMessageID
 */
export const getMessagesFromPrivateConversation = (
  conversationID,
  earliestMessageID = undefined
) => async (dispatch, getState) => {
  const { chat } = getState()
  const privateChatMessages =
    chat.privateConversations[conversationID]?.messages

  if (!earliestMessageID && privateChatMessages.length != 0) return

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

  const snapshot = !earliestMessageID
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

  if (!earliestMessageID) {
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

    if (
      messages.length == 0 ||
      messages[0].messageID === privateChatMessages[0].messageID
    )
      return dispatch(
        setReachFirstMessageState({
          conversationID,
          isPrivateChat: true,
          reachFirstMessageState: true,
        })
      )
    else {
      messages = [...messages, ...privateChatMessages]
    }
  }

  await dispatch(
    addMessagesToPrivateConversation({
      conversationID,
      messages,
    })
  )
}

/**
 * @param {String} conversationID
 * @param {String} earliestMessageID
 */
export const getMessagesFromGroupConversation = (
  conversationID,
  earliestMessageID = undefined
) => async (dispatch, getState) => {
  const { chat } = getState()
  const groupChatMessages = chat.groupConversations[conversationID]?.messages

  if (!earliestMessageID && groupChatMessages.length != 0) return

  let messages = []

  const sp =
    typeof earliestMessageID == 'string'
      ? await firestore
          .collection('GroupConversation')
          .doc(conversationID)
          .collection('Messages')
          .doc(earliestMessageID)
          .get()
      : undefined

  const snapshot = !earliestMessageID
    ? // 10 most recent messages in the chat
      await firestore
        .collection('GroupConversation')
        .doc(conversationID)
        .collection('Messages')
        .orderBy('createdAt')
        .limitToLast(10)
        .get()
    : // <= 10 older messages than the referenced message
      await firestore
        .collection('GroupConversation')
        .doc(conversationID)
        .collection('Messages')
        .where('createdAt', '<', sp.data().createdAt)
        .orderBy('createdAt', 'desc')
        .limitToLast(10)
        .get()

  if (!earliestMessageID) {
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

    if (
      messages.length == 0 ||
      messages[0].messageID === groupChatMessages[0].messageID
    )
      return dispatch(
        setReachFirstMessageState({
          conversationID,
          isPrivateChat: false,
          reachFirstMessageState: true,
        })
      )
    else {
      messages = [...messages, ...groupChatMessages]
    }
  }

  await dispatch(
    addMessagesToGroupConversation({
      conversationID,
      messages,
    })
  )
}

// thunks
/*export const getConversationList = (conversationID) => async (dispatch) => {
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
}*/

/**
 * @param {String} userID
 */
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
        let sortedData = data.sort((a, b) => sortChatFunction(a, b))

        dispatch(addToPrivate(sortedData))
      }
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {String} userID
 */
export const getGroupConversationFromID = (userID) => async (dispatch) => {
  try {
    const snapshot = await firestore
      .collection('GroupConversation')
      .where('users', 'array-contains', userID)
      .orderBy('createdAt', 'desc')
      .get()

    let data = []

    let count = snapshot.size

    snapshot.forEach(async (doc) => {
      const lastMessage = await firestore
        .collection('GroupConversation')
        .doc(doc.id)
        .collection('Messages')
        .orderBy('createdAt')
        .limitToLast(1)
        .get()

      if (lastMessage.size) {
        lastMessage.docs.forEach((_doc) => {
          const lastMessage = _doc.data()
          data.push({
            id: doc.id,
            data: { ...doc.data(), usersDetails: {}, lastMessage },
          })
        })
      } else {
        data.push({
          id: doc.id,
          data: { ...doc.data(), usersDetails: {}, lastMessage: {} },
        })
      }

      count--
      if (count == 0) {
        let sortedData = data.sort((a, b) => sortChatFunction(a, b))

        dispatch(addToGroup(sortedData))
      }
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {String} senderID
 * @param {String} receiverID
 */
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

      await dispatch(updateUsersToAdd({}))

      // Add to local
      await dispatch(
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

/**
 * @param {String} conversationID
 * @param {Object} groupChatInfo
 */
export const createGroupConversation = (hostID, groupChatInfo) => async (
  dispatch,
  getState
) => {
  try {
    const { user } = getState()

    let users = groupChatInfo['users']
    users = {
      [hostID]: {
        uid: user.uid,
        username: user.username,
        photoURL: user.photoURL,
      },
      ...users,
    }

    let data = { ...groupChatInfo, hostID, createdAt: new Date() }
    data['users'] = Object.keys(users)

    const querySnapshot = await firestore
      .collection('GroupConversation')
      .add(data)

    Object.entries(users).forEach(
      async (element) =>
        await firestore
          .collection('GroupConversation')
          .doc(querySnapshot.id)
          .collection('GroupChatMembers')
          .doc(element[0])
          .set(element[1])
    )

    dispatch(
      addToGroup([
        {
          id: querySnapshot.id,
          data: { ...data, createdAt: new Date(), lastMessage: {} },
        },
      ])
    )
  } catch (err) {
    console.error(err)
  }
}

/*
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
}*/

/**
 * @param {String} conversationID
 * @param {Object} message
 */
export const sendPrivateChatMessage = (conversationID, message) => async (
  dispatch,
  getState
) => {
  const { chat } = getState()
  try {
    if (!message || !conversationID) return

    // Check locally if conversation ID exists
    if (!chat.privateConversations.hasOwnProperty(conversationID))
      return dispatch(setError('Conversation not loaded, error aborting.'))

    let messageID

    await firestore
      .collection('PrivateConversation')
      .doc(conversationID)
      .collection('Messages')
      .add(message)
      .then((doc) => (messageID = doc.id))

    let messages = [
      ...chat.privateConversations[conversationID].messages,
      { ...message, messageID },
    ]

    await dispatch(
      addMessagesToPrivateConversation({
        conversationID,
        messages,
      })
    )

    await dispatch(
      putAtTopLastUpToDatePrivateChat({
        id: conversationID,
        lastMessage: { ...message, createdAt: new Date() },
      })
    )
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {String} conversationID
 * @param {Object} message
 */
export const sendGroupChatMessage = (conversationID, message) => async (
  dispatch,
  getState
) => {
  const { chat } = getState()
  try {
    if (!message || !conversationID) return

    // Check locally if conversation ID exists
    if (!chat.groupConversations.hasOwnProperty(conversationID))
      return dispatch(setError('Conversation not loaded, error aborting.'))

    let messageID

    await firestore
      .collection('GroupConversation')
      .doc(conversationID)
      .collection('Messages')
      .add(message)
      .then((doc) => (messageID = doc.id))

    let messages = [
      ...chat.groupConversations[conversationID].messages,
      { ...message, messageID },
    ]

    await dispatch(
      addMessagesToGroupConversation({
        conversationID,
        messages,
      })
    )

    await dispatch(
      putAtTopLastUpToDateGroupChat({
        id: conversationID,
        lastMessage: { ...message, createdAt: new Date() },
      })
    )
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {String} conversationID
 * @param {String} messageID
 * @param {Boolean} isPrivate
 */
export const deleteMessageFromConversation = (
  conversationID,
  messageID,
  isPrivate = true
) => async (dispatch, getState) => {
  try {
    const { chat } = getState()

    const ref = isPrivate
      ? firestore.collection('PrivateConversation')
      : firestore.collection('GroupConversation')

    await ref
      .doc(conversationID)
      .collection('Messages')
      .doc(messageID)
      .update({ type: 'deleted' })

    let messages = isPrivate
      ? chat.privateConversations[conversationID].messages
      : chat.groupConversations[conversationID].messages

    let messageToDelete
    let toDel

    const updatedMessages = messages.map((m, index) => {
      if (m.messageID == messageID) {
        toDel = index
        messageToDelete = { ...m, type: 'deleted' }
        return messageToDelete
      } else return m
    })

    await dispatch(
      isPrivate
        ? addMessagesToPrivateConversation({
            conversationID,
            messages: updatedMessages,
          })
        : addMessagesToGroupConversation({
            conversationID,
            messages: updatedMessages,
          })
    )

    if (toDel == updatedMessages.length - 1)
      await dispatch(
        isPrivate
          ? putAtTopLastUpToDatePrivateChat({
              id: conversationID,
              lastMessage: messageToDelete,
            })
          : putAtTopLastUpToDateGroupChat({
              id: conversationID,
              lastMessage: messageToDelete,
            })
      )
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {String} conversationID
 */
export const getGroupChatMembersDetails = (conversationID) => async (
  dispatch
) => {
  try {
    let usersDetails = {}

    const ref = await firestore.collection('GroupConversation')
    let hostID

    await ref
      .doc(conversationID)
      .get()
      .then((doc) => {
        hostID = doc.data().hostID
      })

    const snapshot = await ref
      .doc(conversationID)
      .collection('GroupChatMembers')
      .get()

    snapshot.docs.map((doc) => {
      const user = doc.data()
      usersDetails[doc.id] = {
        uid: user.uid,
        username: user.username,
        photoURL: user.photoURL,
        isHost: doc.id === hostID,
      }
    })

    await dispatch(
      updateGroupChatMembersDetails({ conversationID, usersDetails })
    )
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {String} conversationID
 * @param {Object} aUsers
 */
export const addUsersToGroupChatAfterCreation = (
  conversationID,
  aUsers
) => async (dispatch, getState) => {
  try {
    const { chat } = getState()
    const ref = firestore.collection('GroupConversation').doc(conversationID)

    await ref.get().then(async (doc) => {
      const chatInfo = doc.data()
      let users = [...chatInfo['users'], ...Object.keys(aUsers)]
      let usersDetails = chat.groupConversations[conversationID].usersDetails

      await ref.update({ users: users })

      Object.entries(aUsers).forEach(
        (user) =>
          (usersDetails[user.uid] = {
            uid: user.uid,
            username: user.username,
            photoURL: user.photoURL,
            isHost: false,
          })
      )

      Object.entries(aUsers).forEach(
        async (element) =>
          await ref
            .collection('GroupChatMembers')
            .doc(element[0])
            .set(element[1])
      )

      await dispatch(updateUsersToAdd({}))

      await dispatch(
        updateGroupChatMembersList({
          conversationID,
          data: {
            users,
            usersDetails,
          },
        })
      )
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {String} conversationID
 */
export const leaveGroupChat = (conversationID) => async (
  dispatch,
  getState
) => {
  try {
    const { user } = getState()
    const ref = firestore.collection('GroupConversation').doc(conversationID)

    await ref.get().then(async (doc) => {
      const chatInfo = doc.data()
      const users = chatInfo['users']
      if (users.length > 1) {
        users.splice(users.indexOf(user.uid), 1)
        await ref.update({ users: users })
        await ref.collection('GroupChatMembers').doc(user.uid).delete()

        if (chatInfo.hostID === user.uid) await ref.update({ hostID: users[0] })
      } else {
        await ref.delete()
        await ref.collection('GroupChatMembers').doc(user.uid).delete()
        await ref
          .collection('Messages')
          .get()
          .then(
            async (doc) => await ref.collection('Messages').doc(doc.id).delete()
          )
      }
      await dispatch(updateGroupConversationsAfterLeaving({ conversationID }))
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {Object} a
 * @param {Object} b
 */
const sortChatFunction = (a, b) => {
  const aLastMessage = a.data.lastMessage
  const aLength = Object.keys(aLastMessage).length
  const bLastMessage = b.data.lastMessage
  const bLength = Object.keys(bLastMessage).length

  if (aLength && bLength) {
    return aLastMessage.createdAt['seconds'] - bLastMessage.createdAt['seconds']
  } else {
    const aCreatedAt = a.data.createdAt
    const bCreatedAt = b.data.createdAt
    if (bLength) {
      return aCreatedAt['seconds'] - bLastMessage.createdAt['seconds']
    } else if (aLength) {
      return aLastMessage.createdAt['seconds'] - bCreatedAt['seconds']
    } else {
      return aCreatedAt['seconds'] - bCreatedAt['seconds']
    }
  }
}

//actions imports
export const {
  updateGroupChatInfo,
  setReachFirstMessageState,
  putAtTopLastUpToDatePrivateChat,
  putAtTopLastUpToDateGroupChat,
  updateUsersToSearch,
  updateUsersToAdd,
  addToPrivate,
  addToGroup,
  setError,
  addMessagesToPrivateConversation,
  addMessagesToGroupConversation,
  updateGroupChatMembersDetails,
  updateGroupConversationsAfterLeaving,
} = chatSlice.actions

// selectors
export const selectGroupChatInfo = (state) => state.chat.groupChatInfo
export const selectGroupChats = (state) => state.chat.groupConversations
export const selectPrivateChats = (state) => state.chat.privateConversations
export const selectUsersToSearch = (state) => state.chat.usersToSearch
export const selectUsersToAdd = (state) => state.chat.usersToAdd
export const selectError = (state) => state.chat.error

export const chatReducer = chatSlice.reducer
