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
        .map((race) => ({ ...race, date: `${dateParameter} ${race.hour}` }))
      return dayRaces
    } else {
      return false
    }
  })

exports.onCreateUser = functions
  .region('europe-west1')
  .auth.user()
  .onCreate((userRecord, context) => {
    const { email, uid } = userRecord

    return db
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
