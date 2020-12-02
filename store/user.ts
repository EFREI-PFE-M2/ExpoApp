import {
  createSlice,
  Dispatch,
  PayloadAction,
  Reducer,
  Slice,
} from '@reduxjs/toolkit'
import { RootState } from '.'
import { FirebaseApp as firebase, FirebaseAuth as auth } from './../firebase'
import { User, UserStore } from './../types'

const defaultUser: User = {
  uid: '',
  username: '',
  email: '',
  photoURL: '',
  emailVerified: undefined,
  notificationSettings: new Map(),
  description: '',
  winPercentage: 0,
  lossPercentage: 0,
  canceledPercentage: 0,
  returnOnInvestment: 0,
  currentSeries: [],
  showStats: false,
  level: 0,
  experience: 0,
  nbFollowers: 0,
  nbFollowing: 0,
}

const defaultUsers: UserStore = {
  users: {},
  current: '',
}

export const userSlice: Slice = createSlice({
  name: 'User',
  initialState: defaultUsers,
  reducers: {
    updateUser: (
      state: UserStore,
      action: PayloadAction<{ uid: string; user: User }>
    ) => {
      const { uid, user } = action.payload
      state.users[uid] = user
    },
    setCurrent: (state: UserStore, action: PayloadAction<{ uid: string }>) => {
      state.current = action.payload.uid
    },
  },
})

export const { updateUser, setCurrent } = userSlice.actions

export const firebaseAuthLogin = (email: string, password: string) => async (
  dispatch: Dispatch
) => {
  try {
    const snapshot: firebase.default.auth.UserCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    )

    let user: User = defaultUser
    user.uid = snapshot.user?.uid || ''
    user.username = snapshot.user?.displayName || ''
    user.email = snapshot.user?.email || ''
    user.photoURL = snapshot.user?.photoURL || ''
    user.emailVerified = snapshot.user?.emailVerified || undefined

    dispatch(updateUser({ uid: user.uid, user }))
    dispatch(setCurrent({ uid: user.uid }))
  } catch (err) {
    console.error(err)
  }
}

export const firebaseAuthCreateUser = (
  email: string,
  password: string
) => async (dispatch: Dispatch) => {
  try {
    const snapshot: firebase.default.auth.UserCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    )

    if (!snapshot.user) {
      throw new Error('Unknown error')
    } else {
      await firebaseAuthLogin(email, password)
    }
  } catch (err) {
    console.error(err)
  }
}

// Export selectors
export const selectCurrent = (state: RootState) =>
  state.user.users[state.user.current]

export const userReducer: Reducer = userSlice.reducer
