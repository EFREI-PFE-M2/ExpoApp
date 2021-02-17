import { createSlice } from '@reduxjs/toolkit'
import { exp } from 'react-native-reanimated'
import { FirebaseFirestore as firestore } from '../firebase'

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
  },
  reducers: {
    updateNotifications: (state, action) => {
      state.notifications = action.payload
    },
  },
})

/**
 * @param {Object} notification
 */
export const createNotification = (notification) => async (dispatch) => {
  try {
    const userID = notification.userID
    const ref = firestore.collection(`Users/${userID}/Notifications`)
    await ref.add(notification)
  } catch (err) {
    console.error(err)
  }
}

/**
 * @param {String} userID
 */
export const getNotifications = (userID) => async (dispatch, getState) => {
  try {
    const { notification } = getState()
    const ref = firestore.collection(`Users/${userID}/Notifications`)

    const snapshot = await ref.orderBy('datetime', 'desc').limit(10).get()

    const notifications = snapshot.docs.map((doc) => doc.data())
    await dispatch(updateNotifications(notifications))
  } catch (err) {
    console.error(err)
  }
}

export const { updateNotifications } = notificationSlice.actions

export const selectNotifications = (state) => state.notification.notifications

export const notificationReducer = notificationSlice.reducer
