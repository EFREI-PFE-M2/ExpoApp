import { createSlice } from '@reduxjs/toolkit';

export const cardGameSlice = createSlice({
  name: 'cardGame',
  initialState: {
    ongoingGames: [],
    searchedUsers: []
  },
  reducers: {},
});

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


export default cardGameSlice.reducer;