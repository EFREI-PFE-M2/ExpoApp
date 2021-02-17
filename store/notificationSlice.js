import { createSlice } from '@reduxjs/toolkit'
import { FirebaseFirestore as firestore } from '../firebase'

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: {},
  },
  reducers: {
    updateNotifications: (state, action) => {
      const { id, notification } = action.payload
      state.notifications[id] = notification
    },
  },
})

/**
 notification
 --- type: follow/like/comment
 --- datatime
 --- userDetails:
    --- uid
    --- displayName
    --- photoURL
 --- listeners: array of uid
 */

/**
 * @param {Object} notification
 */
export const createNotification = (notification) => async (dispatch) => {
  if (!notification) return console.log('notif null')

  const user = notification.userDetails
  const listeners = notification.listeners

  if (!user || !listeners) return console.log('user or listeners null')

  const ref = firestore.collection('Users')

  if (listeners.length > 1) {
    await ref.get().then((doc) => console.log(doc.id))
  } else {
    if (listeners.length == 1) {
      await ref.doc(listeners[0]).collection('Notifications').add(notification)
    }
  }
}

export const notificationReducer = notificationSlice.reducer
