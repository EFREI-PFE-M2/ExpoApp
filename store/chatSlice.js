import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    privateConversations: {
      1: {
        senderID: 'KfOdJZSnByX1iQNZdy5cyDVLSh03',
        senderDisplayName: 'Test user 1',
        senderPhotoURL:
          'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
        receiverID: 'MD3IFJBvLQbKkR3Z8g2BEGJ2Lht2',
        receiverDisplayName: 'Test user 2',
        receivePhotoURL:
          'https://media.npr.org/assets/img/2020/11/01/gettyimages-1256154622_custom-75dab75fd97ed1b3b9a761385d2c33284789bc3b-s800-c85.jpg',
        messages: [
          {
            type: 'text',
            createdAt: new Date().toLocaleString(),
            displayName: 'Test user 1',
            photoURL:
              'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
            uid: 'KfOdJZSnByX1iQNZdy5cyDVLSh03',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().toLocaleString(),
            displayName: 'Test user 2',
            photoURL:
              'https://media.npr.org/assets/img/2020/11/01/gettyimages-1256154622_custom-75dab75fd97ed1b3b9a761385d2c33284789bc3b-s800-c85.jpg',
            uid: 'MD3IFJBvLQbKkR3Z8g2BEGJ2Lht2',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().toLocaleString(),
            displayName: 'Test user 1',
            photoURL:
              'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
            uid: 'KfOdJZSnByX1iQNZdy5cyDVLSh03',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().toLocaleString(),
            displayName: 'Test user 1',
            photoURL:
              'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
            uid: 'KfOdJZSnByX1iQNZdy5cyDVLSh03',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().toLocaleString(),
            displayName: 'Test user 2',
            photoURL:
              'https://media.npr.org/assets/img/2020/11/01/gettyimages-1256154622_custom-75dab75fd97ed1b3b9a761385d2c33284789bc3b-s800-c85.jpg',
            uid: 'MD3IFJBvLQbKkR3Z8g2BEGJ2Lht2',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().toLocaleString(),
            displayName: 'Test user 2',
            photoURL:
              'https://media.npr.org/assets/img/2020/11/01/gettyimages-1256154622_custom-75dab75fd97ed1b3b9a761385d2c33284789bc3b-s800-c85.jpg',
            uid: 'MD3IFJBvLQbKkR3Z8g2BEGJ2Lht2',
            text: 'Lorem ipsum [...]',
          },
          {
            type: 'text',
            createdAt: new Date().toLocaleString(),
            displayName: 'Test user 1',
            photoURL:
              'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
            uid: 'KfOdJZSnByX1iQNZdy5cyDVLSh03',
            text: 'Lorem ipsum [...]',
          },
        ],
      },
    },
    groupConversations: [],
    searchedUsers: [],
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

// thunks

// selectors

export const chatReducer = chatSlice.reducer
