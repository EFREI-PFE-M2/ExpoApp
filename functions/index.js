const functions = require('firebase-functions')
const data = require('./weekRaces')
const admin = require('firebase-admin')
const { firestore } = require('firebase-admin')

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
