import { createSlice } from '@reduxjs/toolkit'
import {
  FirebaseAuth as auth,
  FirebaseFirestore as firestore,
} from '../firebase'
import { setFirebaseAuthError } from './sessionSlice'

export const userSlice = createSlice({
  name: 'User',
  initialState: {
    uid: '',
    username: '',
    email: '',
    photoURL: '',
    emailVerified: undefined,
    winPercentage: 0,
    lossPercentage: 0,
    currentSeries: [],
    showStats: false,
    level: 0,
    experience: 0,
    nbFollowers: 0,
    nbFollowing: 0,
    nbPendingMessages: 0,
    posts: [],
    notificationToken: '',
    notificationState: false,
    cards: [],
  },
  reducers: {
    updateUser: (state, action) => {
      state = Object.assign(state, action.payload)
    },
    setNull: (state) => {
      state = null
    },
    changeNotificationState: (state, action) => {
      state.notificationState = action.payload
    },
  },
})

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
    ---
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

/*
card object format:
let card ={
  name: '',
  description: '',
  rarity: 0,
  picture: ''
  caracteristics: new Map()
}
*/

/*
notification object format:
let notification ={
  type: '',
  datetime: '',
  ===
  followerID: '',
  followerUsername: '',
  followerProfilePicture: '',
  ---
  likeUserID: '',
  likeUsername: '',
  likeUserProfilePicture: '',
  likePostID: '',
  ---
  commentUserID: '',
  commentUsername: '',
  commentUserProfilePicture: '',
  commentPostID: '',
  ---
  betID: '',
  ---
  surveyID: '',
  surveyNbVotes: 0,
  ---
  exchangeUserID: '',
  exchangeUsername: '',
  exchangeUserProfilePicture: '',
  exchangeOffer: '',
  exchangeSubjectCardName: '',
  exchangeSubjectCardID: '',
  ---
  acceptedExchangeUserID: '',
  accepetedExchangeUsername: '',
  acceptedExchangeUserProfilePicture: '',
  ---
  levelReached: 0,
  ---
  groupeID: '',
  groupName: '',
}
*/

export const {
  updateUser,
  setNull,
  changeNotificationState,
} = userSlice.actions

export const firebaseAuthLogin = (email, password) => async (dispatch) => {
  try {
    const snapshot = await auth.signInWithEmailAndPassword(email, password)

    let user = {}
    user.uid = snapshot.user?.uid || ''
    user.username = snapshot.user?.displayName || ''
    user.email = snapshot.user?.email || ''
    user.photoURL = snapshot.user?.photoURL || ''
    user.emailVerified = snapshot.user?.emailVerified || undefined

    let userData
    try {
      const ref = await firestore
        .collection('Users')
        .doc(snapshot.user?.uid)
        .get()
      userData = await ref.data()
    } catch (err) {
      console.error(err)
    }

    dispatch(updateUser(Object.assign(userData, user)))
  } catch (err) {
    dispatch(setFirebaseAuthError(err.code))
    console.error(err)
  }
}

export const firebaseAuthCreateUser = (email, password, username) => async (
  dispatch
) => {
  try {
    const snapshot = await auth.createUserWithEmailAndPassword(email, password)

    if (!snapshot.user) {
      throw new Error('Unknown error')
    }

    // await snapshot.user.updateProfile({
    //   displayName: username,
    // })

    await firestore.collection('Users').doc(snapshot.user.uid).set({
      displayName: username,
    })

    return true
  } catch (err) {
    dispatch(setFirebaseAuthError(err.code))
    console.error(err)
  }
  return false
}

export const autoAuth = () => async (dispatch) => {
  // Firebase auth listener
  await auth.onAuthStateChanged(function (user) {
    if (user) {
      let newUser = {}
      newUser.uid = user.uid
      newUser.username = user.displayName
      newUser.email = user.email
      newUser.photoURL = user.photoURL
      newUser.emailVerified = user.emailVerified
      newUser.loading = false

      dispatch(updateUser(newUser))
      retrieveUserData(user.uid, dispatch)
    }
  })
}

const retrieveUserData = async (id, dispatch) => {
  const resultRef = await firestore.collection('Users').doc(id).get()
  const result = resultRef.data()

  dispatch(updateUser(result))
}

export const logout = () => async (dispatch) => {
  try {
    await auth.signOut()
    dispatch(setNull())
  } catch (err) {
    console.log(err)
  }
}

export const switchNotificationState = (state) => (dispatch) => {
  try {
    // Api calls to flip the value of the darn switch

    // Redux value changes
    dispatch(changeNotificationState(state))
  } catch (err) {
    console.log(err)
  }
}
// Export selectors
export const selectCurrent = (state) => state.user.uid
export const selectCurrentUser = (state) => state.user
export const selectCurrentUserEmail = (state) => state.user.email
export const selectCurrentNotificationToken = (state) =>
  state.user.notificationToken
export const selectCurrentNotificationState = (state) =>
  state.user.notificationState

export const userReducer = userSlice.reducer
