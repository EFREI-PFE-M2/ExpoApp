const functions = require('firebase-functions')
const data = require('./weekRaces')
const admin = require('firebase-admin')
const { firestore } = require('firebase-admin')
const { user } = require('firebase-functions/lib/providers/auth')

admin.initializeApp()

const db = admin.firestore()
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
// Note: default deploy region is us-central-1, always specify to europe-west-1


exports.helloWorld = functions
  .region('europe-west1')
  .https.onRequest((request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true })
    response.send('Hello from Firebase!')
  })
  
exports.races = functions
  .region('europe-west1')
  .https.onCall((contextData, context) => {
    let { date: dateParameter } = contextData
    if (dateParameter) {
      let date = new Date(dateParameter)
      let dayID = date.getDay()
      let dayRaces = data.races
        .filter((race) => race.weekDayID === dayID)
        .map((race) => ({ ...race, date: `${date.toISOString().split('T')[0]}T${race.hour}` }))
      return dayRaces
    } else {
      return false
    }
  })

exports.likePost = functions
.region('europe-west1')
.https.onCall(async (contextData, context) => {
    let {feed, entityID, postID, userID, like} = contextData
    switch(feed){
      case 'race':
        try{
          if(!like){
            //Remove like from Likes collection
            let snapshot = await db.collection(`Races/${entityID}/Posts/${postID}/Likes`)
            .where('userID','==',userID).get()
            snapshot.forEach(doc => {
              doc.ref.delete()
            });

            //decrement nbLikes field
            let decrement = admin.firestore.FieldValue.increment(-1);
            let postRef = db.collection(`Races/${entityID}/Posts`).doc(postID);
            await postRef.update({nbLikes: decrement});

            return true
          }else{
            //Add like to Likes collection
            await db.collection(`Races/${entityID}/Posts/${postID}/Likes`)
            .add({userID: userID})
            
            //increment nbLikes field
            let increment = admin.firestore.FieldValue.increment(1);
            let postRef = db.collection(`Races/${entityID}/Posts`).doc(postID);
            await postRef.update({nbLikes: increment});

            return true;
          }
        }catch(err){
          return false
        }
        break;
      case 'sub':
        break;
      case 'group':
        break;
    }
})


exports.vote = functions
.region('europe-west1')
.https.onCall(async (contextData, context) => {
    let {feed, entityID, postID, userID, response} = contextData
    switch(feed){
      case 'race':
        try{

          //Add vote to Votes collection
          await db.collection(`Races/${entityID}/Posts/${postID}/Votes`)
          .add({userID: userID, response: response})


          //increment response field
          let increment = admin.firestore.FieldValue.increment(1);
          let postRef = db.collection(`Races/${entityID}/Posts`).doc(postID);
          await postRef.update({[`responses.${response}`]: increment});

        }catch(err){
          return false
        }
        break;
      case 'sub':
        break;
      case 'group':
        break;
    }
})


exports.comment = functions
.region('europe-west1')
.https.onCall(async (contextData, context) => {
    let {feed, entityID, postID, userID, datetime, 
      displayName, picture, text} = contextData

    switch(feed){
      case 'race':
        try{

          //Add vote to Votes collection
          await db.collection(`Races/${entityID}/Posts/${postID}/Comments`)
          .add({datetime: datetime, displayName: displayName, picture: picture, userID:userID, text: text})


          //increment response field
          let increment = admin.firestore.FieldValue.increment(1);
          let postRef = db.collection(`Races/${entityID}/Posts`).doc(postID);
          await postRef.update({nbComments: increment});

        }catch(err){
          return false
        }
        break;
      case 'sub':
        break;
      case 'group':
        break;
    }
})

exports.onCreateUser = functions
  .region('europe-west1')
  .auth.user()
  .onCreate(async (userRecord, context) => {
    const { email, uid } = userRecord
    const cards = await db.collection('Cards').where('cardRarity','<',2).get()
    var random = []
    while(random.length<5){
      rand = Math.ceil(Math.random()*(cards.docs.length-1))
      if(!random.includes(rand)){
        random.push(rand)
      }
    }
    for(var k = 0; k < cards.docs.length; k++){
      if(random.includes(k)){
        await db
        .collection('Users')
        .doc(uid)
        .collection('Cards')
        .doc(cards.docs[k].id)
        .set(cards.docs[k].data())
        .catch(console.error)
      }
    }
    await db
      .collection('Users')
      .doc(uid)
      .set({ email, createdAt: admin.firestore.Timestamp.fromDate(new Date()) })
      .catch(console.error)
  })

exports.onCreateConversation = functions
  .region('europe-west1')
  .firestore.document('PrivateConversation/{id}')
  .onCreate((snapshot, context) => {
    const { users } = snapshot.data()

    const fetchAsync = async () => {
      try {
        const [user0, user1] = await Promise.all([
          db.collection('Users').doc(users[0]).get(),
          db.collection('Users').doc(users[1]).get(),
        ])

        return { user0, user1 }
      } catch (err) {
        console.error(err)
      }
    }

    return fetchAsync()
      .then(({ user0, user1 }) => {
        const data0 = user0.data()
        const data1 = user1.data()

        return snapshot.ref.update({
          senderID: user0.id,
          receiverID: user1.id,
          senderDisplayName: data0.displayName || null,
          receiverDisplayName: data1.displayName || null,
          senderPhotoURL: data0.photoURL || null,
          receiverPhotoURL: data1.photoURL || null,
          createdAt: admin.firestore.Timestamp.fromDate(new Date()),
        })
      })
      .catch(console.error)
  })

// TODO: onSendingMessage
exports.onCreateMessage = functions
  .region('europe-west1')
  .firestore.document(
    'PrivateConversation/{conversationID}/messages/{messageID}'
  )
  .onCreate((snapshot, context) => {
    return snapshot.ref.update({
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    })
  })

  exports.onCreateWaitingRoom = functions
  .region('europe-west1')
  .firestore.document('WaitingRoom/{id}')
  .onCreate(async (waitingRecord, context) => {
    size = await db.collection('WaitingRoom').get().then(snap => {return snap.size});
    if (size < 2){
      return null
    }
    const twoFirstDoc = await db
    .collection('WaitingRoom')
    .orderBy('timestamp', "asc")
    .limit(2)
    .get()

    var card=["empty","empty"]
    let user
    
    for (var i=0; i<twoFirstDoc.docs.length; i++){
      user = twoFirstDoc.docs[i].get('userId')
      decks = await db.collection('CardsDeck').where('userId','==',user).get()
      if (!decks.empty){
        for (var k=0; k<decks.docs.length;k++){
          card[i]=decks.docs[k].data().cards[Math.floor(Math.random() * decks.docs[k].data().cards.length)]
        }
      }
      await db.collection('WaitingRoom').doc(twoFirstDoc.docs[i].id).delete()
    };


    const game = await db.collection('Games').add({
      player1Turn: Math.random() < 0.5,
      turnUser1CardId: card[0],
      turnUser2CardId: card[1],
      state: 'initial',
    })

    for (var i=0; i<twoFirstDoc.docs.length; i++){
      user = db.collection('Users').doc(twoFirstDoc.docs[i].get('userId'))
      if(user.get('newGameID') != null){
        await user.update({
          newGameID: game.id
        })
        await user.update({
          player: i+1
        })
      } else {
        await user.set({
          newGameID: game.id,
          player: i+1
        },{merge:true})
      }
    }
  })

exports.onUpdateGame = functions
  .region('europe-west1')
  .firestore.document('Games/{gameID}')
  .onUpdate(async (gameRecord, context) => {
    let { state, turnUser1CardId, turnUser2CardId, chosenCaracteristic, player1Turn, results } = gameRecord.after.data()
    const gameID = context.params.gameID
  
    // if caracteristic has been chosen
    if(typeof chosenCaracteristic !== 'undefined' && chosenCaracteristic !== '') {
  
      // get scores from cards caracteristic
      const card1 = await db.collection('Cards').doc(turnUser1CardId).get()
      const card2 = await db.collection('Cards').doc(turnUser2CardId).get()
      const score1 = card1.get(chosenCaracteristic)
      const score2 = card2.get(chosenCaracteristic)
  
      if(typeof results === 'undefined')
        results = []
  
      // record result
      if(score1 > score2) {
        results.push(1)
      }
      else if(score2 > score1) {
        results.push(2)
      }
      else {
        results.push(0)
      }
  
      // update the game
      return gameRecord.after.ref.update({
        chosenCaracteristic: '',
        results: results,
        state: 'turn_results'
      })
    }
  
    // if end of the turn
    if(state === 'turn_results' && results.length < 5) {
      // find users ID
      const players = await db.collection('Users').where('newGameID', '==', gameID).get()
      if(players.docs[0].get('player') === 1) {
        user1ID = players.docs[0].id
        user2ID = players.docs[1].id
      }
      else {
        user1ID = players.docs[1].id
        user2ID = players.docs[0].id
      }

      // find their deck & select random new card
      const deck1 = await db.collection('CardsDeck').where('userId', '==', user1ID).get()
      const deck2 = await db.collection('CardsDeck').where('userId', '==', user2ID).get()

      var card=['','']
      card[0]=deck1.docs[0].data().cards[Math.floor(Math.random() * deck1.docs[0].data().cards.length)]
      card[1]=deck2.docs[0].data().cards[Math.floor(Math.random() * deck2.docs[0].data().cards.length)]

      // update game
      return gameRecord.after.ref.update({
        player1Turn: !player1Turn,
        chosenCaracteristic: '',
        turnUser1CardId: card[0],
        turnUser2CardId: card[1],
        state: 'new_turn'
      })
    }

    // if end of the game
    if(state === 'turn_results' && results.length >= 5) {
      // compute winner
      nbWin1 = 0
      nbWin2 = 0
      for(var i = 0; i < results.length; i++) {
        if(results[i] === 1) nbWin1++
        if(results[i] === 2) nbWin2++
      }

      // find users ID
      const players = await db.collection('Users').where('newGameID', '==', gameID).get()
      if(players.docs[0].get('player') === 1) {
        user1ID = players.docs[0].id
        user2ID = players.docs[1].id
      }
      else {
        user1ID = players.docs[1].id
        user2ID = players.docs[0].id
      }

      // select winner, if draw, win comes to user who played second
      winnerID = player1Turn ? user2ID : user1ID
      looserID = player1Turn ? user1ID : user2ID
      if(nbWin1 > nbWin2) {
        winnerID = user1ID
        looserID = user2ID
      }
      else if(nbWin1 < nbWin2) {
        winnerID = user2ID
        looserID = user1ID
      }

      // remove game from users
      await db.collection('Users').doc(user1ID).set({
        newGameID: ''
      }, { merge: true })
      await db.collection('Users').doc(user2ID).set({
        newGameID: ''
      }, { merge: true })

      // update the game
      return gameRecord.after.ref.update({
        looserXpWon: 50,
        winnerXpWon: 300,
        winnerID: winnerID,
        looserID: looserID,
        chosenCaracteristic: '',
        turnUser1CardId: '',
        turnUser2CardId: '',
        state: 'game_results'
      })
    }
  
})