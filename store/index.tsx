import { configureStore } from '@reduxjs/toolkit'
import CounterReducer from './counter'

export default configureStore({
  reducer: {
    counter: CounterReducer,
  },
})
