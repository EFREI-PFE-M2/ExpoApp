import { createSlice } from '@reduxjs/toolkit'
import {
  FirebaseAuth as auth,
  FirebaseFirestore as firestore,
} from '../firebase'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    privateConversations: {
      1: {
        senderID: 'Yv4ZvUNErYhEc5l7uJ7ZzhiIyw32', //'KfOdJZSnByX1iQNZdy5cyDVLSh03',
        senderDisplayName: 'Test user 1',
        senderPhotoURL:
          'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
        receiverID: 'MD3IFJBvLQbKkR3Z8g2BEGJ2Lht2',
        receiverDisplayName: 'Test user 2',
        receiverPhotoURL:
          'https://media.npr.org/assets/img/2020/11/01/gettyimages-1256154622_custom-75dab75fd97ed1b3b9a761385d2c33284789bc3b-s800-c85.jpg',
        messages: [
          {
            type: 'text',
            createdAt: new Date().getTime(),
            displayName: 'Test user 1',
            photoURL:
              'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
            uid: 'Yv4ZvUNErYhEc5l7uJ7ZzhiIyw32',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().getTime(),
            displayName: 'Test user 2',
            photoURL:
              'https://media.npr.org/assets/img/2020/11/01/gettyimages-1256154622_custom-75dab75fd97ed1b3b9a761385d2c33284789bc3b-s800-c85.jpg',
            uid: 'MD3IFJBvLQbKkR3Z8g2BEGJ2Lht2',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().getTime(),
            displayName: 'Test user 1',
            photoURL:
              'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
            uid: 'Yv4ZvUNErYhEc5l7uJ7ZzhiIyw32',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().getTime(),
            displayName: 'Test user 1',
            photoURL:
              'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
            uid: 'Yv4ZvUNErYhEc5l7uJ7ZzhiIyw32',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().getTime(),
            displayName: 'Test user 2',
            photoURL:
              'https://media.npr.org/assets/img/2020/11/01/gettyimages-1256154622_custom-75dab75fd97ed1b3b9a761385d2c33284789bc3b-s800-c85.jpg',
            uid: 'MD3IFJBvLQbKkR3Z8g2BEGJ2Lht2',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().getTime(),
            displayName: 'Test user 2',
            photoURL:
              'https://media.npr.org/assets/img/2020/11/01/gettyimages-1256154622_custom-75dab75fd97ed1b3b9a761385d2c33284789bc3b-s800-c85.jpg',
            uid: 'MD3IFJBvLQbKkR3Z8g2BEGJ2Lht2',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().getTime(),
            displayName: 'Test user 1',
            photoURL:
              'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
            uid: 'Yv4ZvUNErYhEc5l7uJ7ZzhiIyw32',
            text: 'Lorem ipsum [...]',
          },
        ],
      },
    },
    groupConversations: [],
    searchedUsers: [],
  },
  reducers: {
    updateSearchedUsers: (state, action) => {
      state.searchedUsers = action.payload
    },
    addToPrivate: (state, action) => {
      const { id, data } = action.payload
      state.privateConversations[id] = data
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

  const ref = await firestore.collection('Users')
  var snapshot

  if (query.length != 0) {
    snapshot = ref
      .where('username', 'array-contains', query)
      .orderBy('username', 'asc')
      .limit(10)
      .get()
    console.log('query null')
  } else {
    snapshot = ref.orderBy('username', 'asc').limit(10).get()
    console.log('query not null')
  }

  if (snapshot.empty) {
    console.log('No results')
  } else {
    snapshot.forEach((doc) => {
      const u = doc.data()
      const user = {}
      user.userID = u.uid
      user.username = u.displayName
      user.photoURL = u.photoURL
      users.push(user)
      console.log(doc.data())
    })
  }

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

export const { updateSearchedUsers, addToPrivate } = chatSlice.actions

// thunks
export const getConversation = (conversationID) => async (dispatch) => {
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
    const snapshot = await firestore.collection('PrivateConversation')
  } catch (err) {
    console.error(err)
  }
}

// selectors
export const selectSearchedUsers = (state) => state.searchedUsers

export const chatReducer = chatSlice.reducer
