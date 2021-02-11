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
      case 'sub':
        try{
          if(!like){
            //Remove like from Likes collection
            let snapshot = await db.collection(`Users/${entityID}/UserPosts/${postID}/Likes`)
            .where('userID','==',userID).get()
            snapshot.forEach(doc => {
              doc.ref.delete()
            });

            //decrement nbLikes field
            let decrement = admin.firestore.FieldValue.increment(-1);
            let postRef = db.collection(`Users/${entityID}/UserPosts`).doc(postID);
            await postRef.update({nbLikes: decrement});

            return true
          }else{
            //Add like to Likes collection
            await db.collection(`Users/${entityID}/UserPosts/${postID}/Likes`)
            .add({userID: userID})
            
            //increment nbLikes field
            let increment = admin.firestore.FieldValue.increment(1);
            let postRef = db.collection(`Users/${entityID}/UserPosts`).doc(postID);
            await postRef.update({nbLikes: increment});

            return true;
          }
        }catch(err){
          return false
        }
      case 'group':
        try{
          if(!like){
            //Remove like from Likes collection
            let snapshot = await db.collection(`Groups/${entityID}/Posts/${postID}/Likes`)
            .where('userID','==',userID).get()
            snapshot.forEach(doc => {
              doc.ref.delete()
            });

            //decrement nbLikes field
            let decrement = admin.firestore.FieldValue.increment(-1);
            let postRef = db.collection(`Groups/${entityID}/Posts`).doc(postID);
            await postRef.update({nbLikes: decrement});

            return true
          }else{
            //Add like to Likes collection
            await db.collection(`Groups/${entityID}/Posts/${postID}/Likes`)
            .add({userID: userID})
            
            //increment nbLikes field
            let increment = admin.firestore.FieldValue.increment(1);
            let postRef = db.collection(`Groups/${entityID}/Posts`).doc(postID);
            await postRef.update({nbLikes: increment});

            return true;
          }
        }catch(err){
          return false
        }
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
        try{
          //Add vote to Votes collection
          await db.collection(`Users/${entityID}/UserPosts/${postID}/Votes`)
          .add({userID: userID, response: response})

          //increment response field
          let increment = admin.firestore.FieldValue.increment(1);
          let postRef = db.collection(`Users/${entityID}/UserPosts`).doc(postID);
          await postRef.update({[`responses.${response}`]: increment});

        }catch(err){
          return false
        }
        break;
      case 'group':
        try{
          //Add vote to Votes collection
          await db.collection(`Groups/${entityID}/Posts/${postID}/Votes`)
          .add({userID: userID, response: response})

          //increment response field
          let increment = admin.firestore.FieldValue.increment(1);
          let postRef = db.collection(`Groups/${entityID}/Posts`).doc(postID);
          await postRef.update({[`responses.${response}`]: increment});

        }catch(err){
          return false
        }
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
        try{

          //Add vote to Votes collection
          await db.collection(`Users/${entityID}/UserPosts/${postID}/Comments`)
          .add({datetime: datetime, displayName: displayName, picture: picture, userID:userID, text: text})


          //increment response field
          let increment = admin.firestore.FieldValue.increment(1);
          let postRef = db.collection(`Users/${entityID}/UserPosts`).doc(postID);
          await postRef.update({nbComments: increment});

        }catch(err){
          return false
        }
        break;
      case 'group':
        try{

          //Add vote to Votes collection
          await db.collection(`Groups/${entityID}/Posts/${postID}/Comments`)
          .add({datetime: datetime, displayName: displayName, picture: picture, userID:userID, text: text})


          //increment response field
          let increment = admin.firestore.FieldValue.increment(1);
          let postRef = db.collection(`Groups/${entityID}/Posts`).doc(postID);
          await postRef.update({nbComments: increment});

        }catch(err){
          return false
        }
        break;
    }
})

exports.follow = functions
.region('europe-west1')
.https.onCall(async (contextData, context) => {
    let {followerID, followedID, follow} = contextData
    
    try {

      if(follow){
        await db
        .collection('Follows')
        .add({ followerID: followerID, followedID: followedID })
  
        await Promise.all([
            db
            .collection('Users')
            .doc(followerID)
            .update({ nbFollowing: admin.firestore.FieldValue.increment(1) }),
            db
            .collection('Users')
            .doc(followedID)
            .update({ nbFollowers: admin.firestore.FieldValue.increment(1) }),
        ])
      }else{
        let snapshot = await db.collection('Follows').where('followerID', '==', followerID ).where('followedID','==', followedID).get();
        

        if (!snapshot.empty) {
          
          snapshot.forEach(function(doc) {
            doc.ref.delete();
          });

          await Promise.all([
              db
              .collection('Users')
              .doc(followerID)
              .update({ nbFollowing: admin.firestore.FieldValue.increment(-1) }),
              db
              .collection('Users')
              .doc(followedID)
              .update({ nbFollowers: admin.firestore.FieldValue.increment(-1) }),
          ])
        } 
  
      }
      
    } catch (err) {
      console.error(err)
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
