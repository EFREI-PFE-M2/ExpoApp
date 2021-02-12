import { createSlice } from '@reduxjs/toolkit'
import { FirebaseApp as firebase } from '../firebase'
import { FirebaseFirestore as firestore } from '../firebase'

export const cardGameSlice = createSlice({
  name: 'cardGame',
  initialState: {
    gameStarted: false,
    state: 'loading',

    user1ID: '',
    user1Username: '',
    user1ProfilePicture: '',

    user2ID: 'MD3IFJBvLQbKkR3Z8g2BEGJ2Lht2',
    user2Username: 'Elon Musk',
    user2ProfilePicture: 'https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/users%2Felon.jpg?alt=media&token=e5e1246a-7add-4267-b4ac-3fde34cc9720',

    user1Score: 0,
    user2Score: 0,

    turnWinnerID: '',
    turnUserID: '',

    turnUser1CardPicture: '',
    turnUser1CardTitle: '',
    turnUser1CardDesc: '',
    turnUser1CardRarity: '',
    turnUser1CardCaracteristics: {},
    turnUser1ChosenCaracteristicTitle: '',
    turnUser1ChosenCaracteristicScore: '',

    turnUser2CardPicture: '',
    turnUser2CardTitle: '',
    turnUser2CardDesc: '',
    turnUser2CardRarity: '',
    turnUser2CardCaracteristics: {},
    turnUser2ChosenCaracteristicTitle: '',
    turnUser2ChosenCaracteristicScore: '',
    

    winnerXpWon: '',
    looserXpWon: '',
    
    winnerID: '',
    winnerCardPicture: '',
    winnerCardName: '',
    winnerCardRarity: '',

    cancelerID: '',
  },
  reducers: {
    setGame: (state, action) => {
      state = Object.assign(state, action.payload)
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
  setGame
} = cardGameSlice.actions

// thunks
/*
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
*/

export const handleGameStateChanges = () => async (dispatch, getState) => {
  // const lists = await firestore.collection('lists').get()
  /*
  let docs
  const lists = await firestore.collection('Games').doc(id).onSnapshot(snapshot => {
    docs = snapshot.docChanges().map(c =>c.doc.data())
    if (docs) {
      return dispatch(receiveLists(docs))    
    }
    return
  })
  */
}


export const simulatorStartGame = () => async (dispatch, getState) => {
  if(!getState().cardGame.gameStarted){
    let randomCard1 = cards[getRandomInt(0,cards.length-1)]
    let randomCard2 = cards[getRandomInt(0,cards.length-1)]
    await new Promise(resolve => setTimeout(()=>{
      dispatch(setGame({
        state: 'attempt', 
        gameStarted: true, 
        turnUserID: 'MD3IFJBvLQbKkR3Z8g2BEGJ2Lht2',
        turnUser1CardPicture: randomCard1.cardPicture,
        turnUser1CardTitle: randomCard1.cardName,
        turnUser1CardDesc: randomCard1.cardDescription,
        turnUser1CardRarity: randomCard1.cardRarity,
        turnUser1CardCaracteristics: {
          corde_droite: randomCard1.corde_droite,
          corde_gauche: randomCard1.corde_gauche,
          herbe: randomCard1.herbe,
          psf: randomCard1.psf,
        },

        turnUser2CardPicture: randomCard2.cardPicture,
        turnUser2CardTitle: randomCard2.cardName,
        turnUser2CardDesc: randomCard2.cardDescription,
        turnUser2CardRarity: randomCard2.cardRarity,
        turnUser2CardCaracteristics: {
          corde_droite: randomCard2.corde_droite,
          corde_gauche: randomCard2.corde_gauche,
          herbe: randomCard2.herbe,
          psf: randomCard2.psf,
        }
    }))
      resolve()
    }, 3000));

    dispatch(simulatorOpponentTurn())
  }
}




export const simulatorOpponentTurn = () => async (dispatch, getState) => {
    
    let randCaracKey = getRandomCarac()
    let score1 = getState().cardGame.turnUser1CardCaracteristics[randCaracKey]
    let score2 = getState().cardGame.turnUser2CardCaracteristics[randCaracKey]
    await new Promise(resolve => setTimeout(()=>{
      dispatch(setGame({
        turnUser2ChosenCaracteristicTitle: caracteristics[randCaracKey],
        turnUser2ChosenCaracteristicScore: score2,
        turnUser1ChosenCaracteristicTitle: caracteristics[randCaracKey],
        turnUser1ChosenCaracteristicScore: score1,
      }))
      resolve()
    }, 3000));
    

    await new Promise(resolve => setTimeout(()=>{
      if(score1 > score2){
        dispatch(setGame({
          turnWinnerID: getState().user.uid,
          state: 'turn_results',
          user1Score: getState().cardGame.user1Score + 1,
        }))
      }else{
        dispatch(setGame({
          turnWinnerID: getState().cardGame.user2ID,
          state: 'turn_results',
          user2Score: getState().cardGame.user2Score + 1,
        }))
      }
      resolve()
    }, 3000));

    if( (getState().cardGame.user1Score + getState().cardGame.user2Score) === 5){
      await new Promise(resolve => setTimeout(()=>{
        let randomPrizeCard = cards[getRandomInt(0,cards.length-1)]
        if(getState().cardGame.user1Score > getState().cardGame.user2Score){
          dispatch(setGame({
            state: 'game_results', 
            winnerXpWon: getState().cardGame.user1Score*20,
            looserXpWon: getState().cardGame.user2Score*5,
            winnerID: getState().user.uid,
            winnerCardPicture: randomPrizeCard.cardPicture,
            winnerCardName: randomPrizeCard.cardName,
            winnerCardRarity: randomPrizeCard.cardRarity,
          }))
        }else{
          dispatch(setGame({
            state: 'game_results', 
            winnerXpWon: getState().cardGame.user2Score*20,
            looserXpWon: getState().cardGame.user1Score*5,
            winnerID: getState().cardGame.user2ID,
            winnerCardPicture: randomPrizeCard.cardPicture,
            winnerCardName: randomPrizeCard.cardName,
            winnerCardRarity: randomPrizeCard.cardRarity,
          }))
        }
        resolve()
      }, 4000));
      
    }else{
      let randomCard1 = cards[getRandomInt(0,cards.length-1)]
      let randomCard2 = cards[getRandomInt(0,cards.length-1)]
      
      await new Promise(resolve => setTimeout(()=>{
        dispatch(setGame({
          state: 'attempt', 
          turnUserID: getState().user.uid,
          turnWinnerID: '',
          turnUser1CardPicture: randomCard1.cardPicture,
          turnUser1CardTitle: randomCard1.cardName,
          turnUser1CardDesc: randomCard1.cardDescription,
          turnUser1CardRarity: randomCard1.cardRarity,
          turnUser1CardCaracteristics: {
            corde_droite: randomCard1.corde_droite,
            corde_gauche: randomCard1.corde_gauche,
            herbe: randomCard1.herbe,
            psf: randomCard1.psf,
          },

          turnUser2CardPicture: randomCard2.cardPicture,
          turnUser2CardTitle: randomCard2.cardName,
          turnUser2CardDesc: randomCard2.cardDescription,
          turnUser2CardRarity: randomCard2.cardRarity,
          turnUser2CardCaracteristics: {
            corde_droite: randomCard2.corde_droite,
            corde_gauche: randomCard2.corde_gauche,
            herbe: randomCard2.herbe,
            psf: randomCard2.psf,
          }
      }))
        resolve()
      }, 4000));
    }
}

export const simulatorCurrentUserTurn = (caracKey) => async (dispatch, getState) => {
    let score1 = getState().cardGame.turnUser1CardCaracteristics[caracKey]
    let score2 = getState().cardGame.turnUser2CardCaracteristics[caracKey]
    dispatch(setGame({
      turnUser2ChosenCaracteristicTitle: caracteristics[caracKey],
      turnUser2ChosenCaracteristicScore: score2,
      turnUser1ChosenCaracteristicTitle: caracteristics[caracKey],
      turnUser1ChosenCaracteristicScore: score1,
    }))

    if(score1 > score2){
      dispatch(setGame({
        turnWinnerID: getState().user.uid,
        state: 'turn_results',
        user1Score: getState().cardGame.user1Score + 1,
      }))
    }else{
      dispatch(setGame({
        turnWinnerID: getState().cardGame.user2ID,
        state: 'turn_results',
        user2Score: getState().cardGame.user2Score + 1,
      }))
    }

    if( (getState().cardGame.user1Score + getState().cardGame.user2Score) === 5){
      await new Promise(resolve => setTimeout(()=>{
        if(getState().cardGame.user1Score > getState().cardGame.user2Score){
          let randomPrizeCard = cards[getRandomInt(0,cards.length-1)]
          dispatch(setGame({
            state: 'game_results', 
            winnerXpWon: getState().cardGame.user1Score*20,
            looserXpWon: getState().cardGame.user2Score*5,
            winnerID: getState().user.uid,
            winnerCardPicture: randomPrizeCard.cardPicture,
            winnerCardName: randomPrizeCard.cardName,
            winnerCardRarity: randomPrizeCard.cardRarity,
          }))
        }else{
          dispatch(setGame({
            state: 'game_results', 
            winnerXpWon: getState().cardGame.user2Score*20,
            looserXpWon: getState().cardGame.user1Score*5,
            winnerID: getState().cardGame.user2ID,
            winnerCardPicture: randomPrizeCard.cardPicture,
            winnerCardName: randomPrizeCard.cardName,
            winnerCardRarity: randomPrizeCard.cardRarity,
          }))
        }
        resolve()
      }, 4000));
      
      
    }else{
      let randomCard1 = cards[getRandomInt(0,cards.length-1)]
      let randomCard2 = cards[getRandomInt(0,cards.length-1)]
      
      await new Promise(resolve => setTimeout(()=>{
        dispatch(setGame({
          state: 'attempt', 
          turnUserID: getState().cardGame.user2ID,
          turnWinnerID: '',
          turnUser1CardPicture: randomCard1.cardPicture,
          turnUser1CardTitle: randomCard1.cardName,
          turnUser1CardDesc: randomCard1.cardDescription,
          turnUser1CardRarity: randomCard1.cardRarity,
          turnUser1CardCaracteristics: {
            corde_droite: randomCard1.corde_droite,
            corde_gauche: randomCard1.corde_gauche,
            herbe: randomCard1.herbe,
            psf: randomCard1.psf,
          },

          turnUser2CardPicture: randomCard2.cardPicture,
          turnUser2CardTitle: randomCard2.cardName,
          turnUser2CardDesc: randomCard2.cardDescription,
          turnUser2CardRarity: randomCard2.cardRarity,
          turnUser2CardCaracteristics: {
            corde_droite: randomCard2.corde_droite,
            corde_gauche: randomCard2.corde_gauche,
            herbe: randomCard2.herbe,
            psf: randomCard2.psf,
          }
        }))
        resolve()
      }, 4000));


      dispatch(simulatorOpponentTurn())
    }

}

export const simulatorEndGame = () => async (dispatch, getState) => {
  dispatch(setGame({
    gameStarted: false,
    state: 'loading', 
    user1Score: 0,
    user2Score: 0,
    turnWinnerID: '',
    turnUserID: '',
    turnUser1CardPicture: '',
    turnUser1CardTitle: '',
    turnUser1CardDesc: '',
    turnUser1CardRarity: '',
    turnUser1CardCaracteristics: {},
    turnUser1ChosenCaracteristicTitle: '',
    turnUser1ChosenCaracteristicScore: '',
    turnUser2CardPicture: '',
    turnUser2CardTitle: '',
    turnUser2CardDesc: '',
    turnUser2CardRarity: '',
    turnUser2CardCaracteristics: {},
    turnUser2ChosenCaracteristicTitle: '',
    turnUser2ChosenCaracteristicScore: '',
    winnerXpWon: '',
    looserXpWon: '',
    winnerID: '',
    winnerCardPicture: '',
    winnerCardName: '',
    winnerCardRarity: '',
  }))
}

// selectors
export const selectUserResults = ({ cardGame }) => cardGame.searchedUsers
export const selectDeck = ({ cardGame }) => cardGame.deck




export const cardGameReducer = cardGameSlice.reducer

function getRandomCarac() {
  return Object.keys(caracteristics)[getRandomInt(0,Object.keys(caracteristics).length-1)]
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const caracteristics = {
  corde_droite: 'Corde droite',
  corde_gauche: 'Corde gauche',
  herbe: 'Herbe',
  psf: 'Psf'
}
const cards = [
  {
    "cardDescription": "Winner of the first Kentucky Derby",
    "cardName": "Secretariat",
    "cardPicture": "https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/cards%2Fhorse2.jpg?alt=media&token=d2f5d5df-4e78-4fa3-9e8e-410b3d6097ae",
    "cardRarity": 4,
    "corde_droite": 14,
    "corde_gauche": 21,
    "herbe": 85,
    "psf": 57,
  },
  {
    "cardDescription": "Winner of the English Triple Crown",       
    "cardName": "Seattle Slew",
    "cardPicture": "https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/cards%2Fhorse8.jpg?alt=media&token=470a24b9-cc1e-414a-a8bb-145fbaaaf467",
    "cardRarity": 1,
    "corde_droite": 100,
    "corde_gauche": 80,
    "herbe": 53,
    "psf": 22,
  },
  {
    "cardDescription": "three-time winner of the Maryland Hunt Cup and the Grand National",
    "cardName": "Man o’ War",
    "cardPicture": "https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/cards%2Fhorse7.jpg?alt=media&token=4703c27d-a359-48a6-a4b9-66efcf6caf85",
    "cardRarity": 5,
    "corde_droite": 26,
    "corde_gauche": 64,
    "herbe": 56,
    "psf": 16,
  },
  {
    "cardDescription": "finished second to Affirmed in all three 1978 Triple Crown races",
    "cardName": "Foudre",
    "cardPicture": "https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/cards%2Fhorse9.jpg?alt=media&token=dfa22774-f182-486f-9981-e20fccdfb4dc",
    "cardRarity": 3,
    "corde_droite": 52,
    "corde_gauche": 3,
    "herbe": 38,
    "psf": 69,
  },
  {
    "cardDescription": "Irish hurdler, winner of a record 22 Grade I races",
    "cardName": "Red Rum",
    "cardPicture": "https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/cards%2Fhorse8.jpg?alt=media&token=470a24b9-cc1e-414a-a8bb-145fbaaaf467",
    "cardRarity": 2,
    "corde_droite": 62,
    "corde_gauche": 79,
    "herbe": 3,
    "psf": 30,
  },
  {
    "cardDescription": "winner of the 2007 Cairns Cup",
    "cardName": "Seabiscuit",
    "cardPicture": "https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/cards%2Fhorse2.jpg?alt=media&token=d2f5d5df-4e78-4fa3-9e8e-410b3d6097ae",
    "cardRarity": 5,
    "corde_droite": 63,
    "corde_gauche": 12,
    "herbe": 78,
    "psf": 54,
  },
  {
    "cardDescription": "French Arc winner and first filly to win a million dollars",
    "cardName": "Kelso",
    "cardPicture": "https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/cards%2Fhorse5.jpg?alt=media&token=95e33297-5a54-4341-b26a-ba06d443f212",
    "cardRarity": 5,
    "corde_droite": 92,
    "corde_gauche": 81,
    "herbe": 70,
    "psf": 21,
  },
  {
    "cardDescription": "Winner of the first Kentucky Derby",
    "cardName": "Native Dancer",
    "cardPicture": "https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/cards%2Fhorse8.jpg?alt=media&token=470a24b9-cc1e-414a-a8bb-145fbaaaf467",
    "cardRarity": 0,
    "corde_droite": 88,
    "corde_gauche": 28,
    "herbe": 94,
    "psf": 42,
  },
  {
    "cardDescription": "First and second winner of the Melbourne Cup",
    "cardName": "Lotus",
    "cardPicture": "https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/cards%2Fhorse2.jpg?alt=media&token=d2f5d5df-4e78-4fa3-9e8e-410b3d6097ae",
    "cardRarity": 3,
    "corde_droite": 80,
    "corde_gauche": 98,
    "herbe": 16,
    "psf": 44,
  },
  {
    "cardDescription": "first Australian horse to top $1million in stakes earnings",
    "cardName": "Alydar",
    "cardPicture": "https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/cards%2Fhorse1.jpg?alt=media&token=3a2ba404-e99d-4770-b3c3-ffd37e71f602",
    "cardRarity": 5,
    "corde_droite": 81,
    "corde_gauche": 65,
    "herbe": 100,
    "psf": 70,
  }
]