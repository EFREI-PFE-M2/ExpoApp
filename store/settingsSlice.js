import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    enableNotifications: false,
    language: '',
  },
  reducers: {},
})

//actions imports

// thunks

// selectors

export const settingsReducer = settingsSlice.reducer
