import { createSlice } from '@reduxjs/toolkit'
import { FirebaseApp as firebase } from '../firebase'
import { FirebaseFirestore as firestore } from '../firebase'

export const cardGameSlice = createSlice({
  name: 'cardGame',
  initialState: {
    
  },
  reducers: {},
})

/*
searched user object format:
let user = {
  userID: '',
  username: '',
  profilePicture: '',
}
*/

/*
game object format: {
    opponentID: '',
    opponentUsername: '',
    opponentProfilePicture: '',
    results: new Map(),
    turnUserID: '',
    turnUserCardID: '',
    turnUserCardTitle: '',
    turnUserCardRarity: '',
    turnUserCardPicture: '',
    turnUserCaracteristicTitle: '',
    turnUserCaracteristicScore: 0,
    turnOpponentCardID: '',
    turnOpponentCardTitle: '',
    turnOpponentCardRarity: '',
    turnOpponentCardPicture: '',
    turnOpponentCaracteristicTitle: '',
    turnOpponentCaracteristicScore: 0
}
*/

//actions imports

// thunks

// selectors

export const handleGameStateChanges = () => async dispatch => {
  // const lists = await firestore.collection('lists').get()
  let docs
  const lists = await firestore.collection('Games').doc(id).onSnapshot(snapshot => {
    docs = snapshot.docChanges().map(c =>c.doc.data())
    if (docs) {
      return dispatch(receiveLists(docs))    
    }
    return
  })
}

export const cardGameReducer = cardGameSlice.reducer
