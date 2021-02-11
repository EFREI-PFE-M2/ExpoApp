import { createSlice } from '@reduxjs/toolkit'
import { FirebaseApp as firebase } from '../firebase'
import { FirebaseFirestore as firestore } from '../firebase'

export const cardGameSlice = createSlice({
  name: 'cardGame',
  initialState: {
    state: '',
    user1ID: '',
    user1Username: '',
    user1ProfilePicture: '',
    user2ID: '',
    user2Username: '',
    user2ProfilePicture: '',
    results: '',
    turnWinnerID: '',
    turnUser1CardTitle: '',
    turnUser1CardDesc: '',
    turnUser1CardRarity: '',
    turnUser1CardPicture: '',
    turnUser1CardCaracteristics: '',
    turnUser1ChosenCaracteristicTitle: '',
    turnUser1ChosenCaracteristicScore: '',
    turnUser2CardTitle: '',
    turnUser2CardDesc: '',
    turnUser2CardRarity: '',
    turnUser2CardPicture: '',
    turnUser2CardCaracteristics: '',
    turnUser2ChosenCaracteristicTitle: '',
    turnUser2ChosenCaracteristicScore: '',
    winnerID: '',
    looserXpWon: '',
    winnerXpWon: '',
    winnerCardPicture: '',
    winnerCardName: '',
    winnerCardRarity: '',
    cancelerID: '',
  },
  reducers: {
    addSearchedUser:(state, action)=>{
      state.searchedUsers.push(action.payload)
    },
    clearSearchedUser:(state)=>{
      state.searchedUsers=[]
    },
    addDeck:(state, action)=>{
      state.deck.push(action.payload)
    },
    clearDeck:(state)=>{
      state.deck=[]
    },
  },
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
export const {
  addSearchedUser,
  clearSearchedUser,
  addDeck,
  clearDeck
} = cardGameSlice.actions

// thunks

export const searchUser = (userName) => async(dispatch) =>{
  await dispatch(clearSearchedUser())
  const searchedUser = await firestore.collection('Users').orderBy('displayName').startAt(userName).endAt(userName+'\uf8ff').get()
  searchedUser.forEach(async (element) => {
    await dispatch(addSearchedUser({
      userID: element.id,
      username: element.get('displayName'),
      profilePicture: element.get('photoURL')
    }))
  });
}

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

// selectors
export const selectUserResults = ({ cardGame }) => cardGame.searchedUsers
export const selectDeck = ({ cardGame }) => cardGame.deck




export const cardGameReducer = cardGameSlice.reducer
