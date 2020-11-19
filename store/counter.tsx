import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    addValue: (state) => {
      state.value = state.value + 1
    },
  },
})

export const { addValue } = counterSlice.actions

export default counterSlice.reducer