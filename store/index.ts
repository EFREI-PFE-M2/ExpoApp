import { configureStore } from '@reduxjs/toolkit'
import CounterReducer from './counter'
import { userReducer } from './user'

export const store = configureStore({
  reducer: {
    counter: CounterReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
