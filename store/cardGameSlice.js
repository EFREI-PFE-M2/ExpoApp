import { FirebaseFirestore as firestore} from '../firebase'
import { createSlice } from '@reduxjs/toolkit'

export const cardGameSlice = createSlice({
  name: 'cardGame',
  initialState: {
    ongoingGames: [],
    searchedUsers: [],
    deck: [],
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
export const getDeck = (userId) => async(dispatch) =>{
  await dispatch(clearDeck())
  const idDeck = await firestore.collection('CardsDeck').where('userId','==',userId).get()
  for (var i=0; i<idDeck.docs.length; i++){
    cards = await idDeck.docs[i].get('cards')
    for (const idCard of cards){
      card = await firestore.collection('Cards').doc(idCard).get()
      await dispatch(addDeck(card.data()))
    }
  }
}

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


// selectors
export const selectUserResults = ({ cardGame }) => cardGame.searchedUsers
export const selectDeck = ({ cardGame }) => cardGame.deck


export const cardGameReducer = cardGameSlice.reducer
