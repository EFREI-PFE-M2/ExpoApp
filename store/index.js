import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './userSlice'
import { cardGameReducer } from './cardGameSlice'
import { chatReducer } from './chatSlice'
import { foreignUserReducer } from './foreignUserSlice'
import { groupReducer } from './groupSlice'
import { raceReducer } from './raceSlice'
import { searchReducer } from './searchSlice'
import { subscriberFeedReducer } from './subscriberFeedSlice'
import { settingsReducer } from './settingsSlice'
import { sessionReducer } from './sessionSlice'
import { postEditorReducer } from './postEditorSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    cardGame: cardGameReducer,
    chat: chatReducer,
    foreignUser: foreignUserReducer,
    group: groupReducer,
    race: raceReducer,
    search: searchReducer,
    subscriberFeed: subscriberFeedReducer,
    settings: settingsReducer,
    session: sessionReducer,
    postEditor: postEditorReducer
  },
})
