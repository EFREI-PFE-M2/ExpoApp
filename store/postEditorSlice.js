import { createSlice } from '@reduxjs/toolkit'
import firebase, { FirebaseFirestore as firestore } from '../firebase'

export const postEditorSlice = createSlice({
  name: 'postEditor',
  initialState: {
    text: '',
    image: null,
    survey: null,
    betData: null
  },
  reducers: {
    setText: (state, action) => {
      state.text = action.payload
    },
    setImage: (state, action) => {
        state.image = action.payload
    },
    setSurvey: (state, action) => {
        state.survey = action.payload
    },
    setSurveyResponses: (state, action) => {
        let {index, text} = action.payload
        state.survey = {...state.survey, responses: 
          state.survey.responses.map((resp, idx)=> idx === index ? text : resp )}
    },
    setSurveyDurationTime: (state, action) => {
      let {duration} = action.payload
        state.survey = {...state.survey, nbMinutesDuration: duration}
    },
    addSurveyResponseField: (state, action) => {
      state.survey = {...state.survey, responses: [...state.survey.responses, '']}
    },
    setBetData: (state, action) => {
        state.betData = action.payload
    },
  },
})

//actions exports
export const { setText, setImage, setSurvey, setSurveyResponses, setSurveyDurationTime, addSurveyResponseField, setBetData } = postEditorSlice.actions

// selectors
export const selectText = state => state.postEditor.text;
export const selectImage = state => state.postEditor.image;
export const selectSurvey = state => state.postEditor.survey;
export const selectBetData = state => state.postEditor.betData;


export const postEditorReducer = postEditorSlice.reducer
