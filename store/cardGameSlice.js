import { FirebaseFirestore as firestore} from '../firebase'
import { createSlice } from '@reduxjs/toolkit'

export const cardGameSlice = createSlice({
  name: 'cardGame',
  initialState: {
    ongoingGames: [],
    searchedUsers: [],
  },
  reducers: {
    addSearchedUser:(state, action)=>{
      state.searchedUsers.push(action.payload)
    },
    clearSearchedUser:(state)=>{
      state.searchedUsers=[]
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
} = cardGameSlice.actions

// thunks
export const getDeck = async(userId) =>{
  await firestore.collection('CardsDeck').where('userId','==',userId).get()
}

export const searchUser = (userName) => async(dispatch) =>{
  await dispatch(clearSearchedUser())
  const searchedUser = await firestore.collection('Users').orderBy('displayName').startAt(username).endAt(username+'\uf8ff').get()
  searchedUser.forEach(async (element) => {
    await dispatch(addSearchedUser(element))
  });
}


// selectors
export const selectUserResults = ({ cardGame }) => cardGame.searchedUsers


export const cardGameReducer = cardGameSlice.reducer
