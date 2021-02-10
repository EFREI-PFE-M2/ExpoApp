import { createSlice } from '@reduxjs/toolkit'
import {
  FirebaseAuth as auth,
  FirebaseFirestore as firestore,
} from '../firebase'
import { getUserGroup } from './groupSlice'
import { getInitRaces } from './raceSlice'
import { setFirebaseAuthError } from './sessionSlice'
import firebase from 'firebase'

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
    cardsLoading: false
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
    setCards: (state, action) => {
      state.cards = action.payload
    },
    setCardsLoading: (state, action) => {
      state.cardsLoading = action.payload
    }
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
  setCards,
  setCardsLoading
} = userSlice.actions


export const updateCards = () => async (dispatch, getState) => {
  dispatch(setCards([]))
  dispatch(setCardsLoading(true))
  try{
    let currentUser = getState().user
    let snapshot = await firestore.collection(`Users/${currentUser.uid}/Cards`).get()
  
    if (snapshot.empty) {
      console.log('No matching document');
      dispatch(setCardsLoading(false))
      return;
    }
  
    let cards = []
  
    for(doc of snapshot.docs) {
      let card = doc.data()
      delete card.createdAt
  
      cards.push(card)
    } 
    dispatch(setCards(cards))
    dispatch(setCardsLoading(false))
  }catch(err){
    console.log(err)
    alert('Internal error')
    dispatch(setCardsLoading(false))
  }
}


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
    let completedUser = Object.assign(userData, user)
    delete completedUser.createdAt

    dispatch(updateUser(completedUser))
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
      // dispatch(getInitRaces(new Date().toDateString()))
      dispatch(getUserGroup(user.uid))
    }
  })
}

const retrieveUserData = async (id, dispatch) => {
  const resultRef = await firestore.collection('Users').doc(id).get()
  const result = resultRef.data()
  delete result.createdAt
  
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

export const userFollow = (userID, followUserID) => async (dispatch) => {
  if (!userID || !followUserID) return

  try {
    await firestore
      .collection('Followers')
      .add({ followedID: followUserID, followerID: userID })

    await Promise.all([
      firestore
        .collection('Users')
        .doc(userID)
        .set({ nbFollowing: firebase.firestore.FieldValue.increment(1) }),
      firestore
        .collection('Users')
        .doc(followUserID)
        .set({ nbFollowers: firebase.firestore.FieldValue.increment(1) }),
    ])
  } catch (err) {
    console.error(err)
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

export const selectCards = (state) => state.user.cards
export const selectCardsLoading = (state) => state.user.cardsLoading

export const userReducer = userSlice.reducer
