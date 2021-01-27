import { createSlice } from '@reduxjs/toolkit'
import { FirebaseAuthError } from '../constants/FirebaseError'

export const SessionSlice = createSlice({
  name: 'Session',
  initialState: {
    firebaseAuthError: '',
  },
  reducers: {
    setFirebaseAuthError: (state, action) => {
      state.firebaseAuthError = action.payload
    },
  },
})

export const { setFirebaseAuthError } = SessionSlice.actions

// Selectors
export const selectFirebaseAuthError = (state) => {
  return state.session.firebaseAuthError
    ? FirebaseAuthError(state.session.firebaseAuthError)
    : ''
}

export const sessionReducer = SessionSlice.reducer
