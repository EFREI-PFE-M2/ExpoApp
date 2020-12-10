const firebase = require('firebase')
require('firebase/functions')

// Initialize Firebase
if (firebase.app.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyA-SLO1ZJg6IUWvZWZoL7fndCXzUU5cphk',
    authDomain: 'pmu-commu.firebaseapp.com',
    databaseURL: 'https://pmu-commu.firebaseio.com',
    projectId: 'pmu-commu',
    storageBucket: 'pmu-commu.appspot.com',
    messagingSenderId: '651773660084',
    appId: '1:651773660084:web:fea1eabff5a5cdf29f40e1',
    measurementId: 'G-C5F8DB8CPV',
  })
}

const auth = firebase.auth()
const firestore = firebase.firestore()

const userCollection = []

// Filling test users
async function fillAuth() {
  try {
    await Promise.all([
      auth
        .createUserWithEmailAndPassword('test1@test.fr', '1234Qwer')
        .then(async (snapshot) => {
          await snapshot.user.updateProfile({
            displayName: 'Test1',
            photoURL:
              'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
          })
          await firestore.collection('Users').doc(snapshot.user.uid).set({
            winPercentage: 50,
            lossPercentage: 50,
            currentSeries: [],
            showStats: false,
            level: 99,
            experience: 999,
            nbFollowers: 999,
            nbFollowing: 999,
            nbPendingMessages: 10,
            posts: [],
            notifications: [],
            cards: [],
          })
          userCollection.push(snapshot.user)
        }),
      auth
        .createUserWithEmailAndPassword('test2@test.fr', '1234Qwer')
        .then(async (snapshot) => {
          await snapshot.user.updateProfile({
            displayName: 'Test2',
            photoURL:
              'https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg',
          })
          await firestore.collection('Users').doc(snapshot.user.uid).set({
            winPercentage: 30,
            lossPercentage: 70,
            currentSeries: [],
            showStats: false,
            level: 100,
            experience: 999,
            nbFollowers: 999,
            nbFollowing: 999,
            nbPendingMessages: 10,
            posts: [],
            notifications: [],
            cards: [],
          })
          userCollection.push(snapshot.user)
        }),
      auth
        .createUserWithEmailAndPassword('test3@test.fr', '1234Qwer')
        .then(async (snapshot) => {
          await snapshot.user.updateProfile({
            displayName: 'Test3',
          })
          await firestore.collection('Users').doc(snapshot.user.uid).set({
            winPercentage: 50,
            lossPercentage: 50,
            currentSeries: [],
            showStats: false,
            level: 99,
            experience: 999,
            nbFollowers: 999,
            nbFollowing: 999,
            nbPendingMessages: 10,
            posts: [],
            notifications: [],
            cards: [],
          })
          userCollection.push(snapshot.user)
        }),
      auth
        .createUserWithEmailAndPassword('test4@test.fr', '1234Qwer')
        .then(async (snapshot) => {
          await snapshot.user.updateProfile({
            displayName: 'Test4',
          })
          await firestore.collection('Users').doc(snapshot.user.uid).set({
            winPercentage: 50,
            lossPercentage: 50,
            currentSeries: [],
            showStats: false,
            level: 99,
            experience: 999,
            nbFollowers: 999,
            nbFollowing: 999,
            nbPendingMessages: 10,
            posts: [],
            notifications: [],
            cards: [],
          })
          userCollection.push(snapshot.user)
        }),
      auth
        .createUserWithEmailAndPassword('test5@test.fr', '1234Qwer')
        .then(async (snapshot) => {
          await snapshot.user.updateProfile({
            displayName: 'Test5',
          })
          await firestore.collection('Users').doc(snapshot.user.uid).set({
            winPercentage: 50,
            lossPercentage: 50,
            currentSeries: [],
            showStats: false,
            level: 99,
            experience: 999,
            nbFollowers: 999,
            nbFollowing: 999,
            nbPendingMessages: 10,
            posts: [],
            notifications: [],
            cards: [],
          })
          userCollection.push(snapshot.user)
        }),
      auth
        .createUserWithEmailAndPassword('test6@test.fr', '1234Qwer')
        .then(async (snapshot) => {
          await snapshot.user.updateProfile({
            displayName: 'Test6',
          })
          await firestore.collection('Users').doc(snapshot.user.uid).set({
            winPercentage: 50,
            lossPercentage: 50,
            currentSeries: [],
            showStats: false,
            level: 99,
            experience: 999,
            nbFollowers: 999,
            nbFollowing: 999,
            nbPendingMessages: 10,
            posts: [],
            notifications: [],
            cards: [],
          })
          userCollection.push(snapshot.user)
        }),
      auth
        .createUserWithEmailAndPassword('test7@test.fr', '1234Qwer')
        .then(async (snapshot) => {
          await snapshot.user.updateProfile({
            displayName: 'Test7',
          })
          await firestore.collection('Users').doc(snapshot.user.uid).set({
            winPercentage: 50,
            lossPercentage: 50,
            currentSeries: [],
            showStats: false,
            level: 99,
            experience: 999,
            nbFollowers: 999,
            nbFollowing: 999,
            nbPendingMessages: 10,
            posts: [],
            notifications: [],
            cards: [],
          })
          userCollection.push(snapshot.user)
        }),
    ])
    console.log('Users generated.')
  } catch (err) {
    console.log(err)
  }
}

// Filling followers
async function fillFollowers() {
  try {
    const list = []
    userCollection.map(async (user) => {
      userCollection.map(async (followUser) => {
        if (user.uid !== followUser.uid) {
          list.push(
            firestore.collection('Followers').add({
              followerID: followUser.uid,
              followedID: user.uid,
            })
          )
        }
      })
    })
    await Promise.all(list)
    console.log('Followers generated.')
  } catch (err) {
    console.log(err)
  }
}

// Filling groups
async function fillGroups() {
  try {
    await Promise.all([
      firestore.collection('Groups').add({
        name: 'TestGroup1',
        masterID: userCollection[0].uid,
        private: false,
        nbMenbers: 2,
        createDate: new Date().toISOString(),
        picture: 'https://www.pmu.fr/turf/icons/Turf.png',
        groupMembers: [
          {
            uid: userCollection[1].uid,
            name: userCollection[1].displayName,
            photoURL: userCollection[1].photoURL,
          },
          {
            uid: userCollection[2].uid,
            name: userCollection[2].displayName,
            photoURL: userCollection[2].photoURL,
          },
          {
            uid: userCollection[3].uid,
            name: userCollection[3].displayName,
            photoURL: userCollection[3].photoURL,
          },
          {
            uid: userCollection[4].uid,
            name: userCollection[4].displayName,
            photoURL: userCollection[4].photoURL,
          },
        ],
        groupJoinPendingRequests: [
          {
            uid: userCollection[5].uid,
            name: userCollection[5].displayName,
            photoURL: userCollection[5].photoURL,
          },
        ],
        groupPosts: [
          {
            type: 'text',
            nbLikes: 100,
            nbComments: 100,
            datetime: new Date().toISOString(),
            uid: userCollection[0].uid,
            photoURL: userCollection[0].photoURL,
            username: userCollection[0].displayName,
            text: 'Content of this post is censored',
            groupPostVotes: [{ uid: userCollection[0].uid, responseIndex: 0 }],
            groupPostComments: [
              {
                uid: userCollection[1].uid,
                username: userCollection[1].displayName,
                datetime: new Date().toISOString(),
                text: 'Great comment #1',
              },
              {
                uid: userCollection[1].uid,
                username: userCollection[1].displayName,
                datetime: new Date().toISOString(),
                text: 'Great comment #2',
              },
            ],
            groupPostLikes: [userCollection[0].uid, userCollection[1].uid],
          },
        ],
      }),
      firestore.collection('Groups').add({
        name: 'TestGroup1',
        masterID: userCollection[0].uid,
        private: false,
        nbMenbers: 2,
        createDate: new Date().toISOString(),
        picture: 'https://www.pmu.fr/turf/icons/Turf.png',
        groupMembers: [
          {
            uid: userCollection[1].uid,
            name: userCollection[1].displayName,
            photoURL: userCollection[1].photoURL,
          },
          {
            uid: userCollection[2].uid,
            name: userCollection[2].displayName,
            photoURL: userCollection[2].photoURL,
          },
          {
            uid: userCollection[3].uid,
            name: userCollection[3].displayName,
            photoURL: userCollection[3].photoURL,
          },
          {
            uid: userCollection[4].uid,
            name: userCollection[4].displayName,
            photoURL: userCollection[4].photoURL,
          },
        ],
        groupJoinPendingRequests: [
          {
            uid: userCollection[5].uid,
            name: userCollection[5].displayName,
            photoURL: userCollection[5].photoURL,
          },
        ],
        groupPosts: [
          {
            type: 'text',
            nbLikes: 100,
            nbComments: 100,
            datetime: new Date().toISOString(),
            uid: userCollection[0].uid,
            photoURL: userCollection[0].photoURL,
            username: userCollection[0].displayName,
            text: 'Content of this post is censored',
            groupPostVotes: [{ uid: userCollection[0].uid, responseIndex: 0 }],
            groupPostComments: [
              {
                uid: userCollection[1].uid,
                username: userCollection[1].displayName,
                datetime: new Date().toISOString(),
                text: 'Great comment #1',
              },
              {
                uid: userCollection[1].uid,
                username: userCollection[1].displayName,
                datetime: new Date().toISOString(),
                text: 'Great comment #2',
              },
            ],
            groupPostLikes: [userCollection[0].uid, userCollection[1].uid],
          },
        ],
      }),
      firestore.collection('Groups').add({
        name: 'TestGroup1',
        masterID: userCollection[0].uid,
        private: false,
        nbMenbers: 2,
        createDate: new Date().toISOString(),
        picture: 'https://www.pmu.fr/turf/icons/Turf.png',
        groupMembers: [
          {
            uid: userCollection[1].uid,
            name: userCollection[1].displayName,
            photoURL: userCollection[1].photoURL,
          },
          {
            uid: userCollection[2].uid,
            name: userCollection[2].displayName,
            photoURL: userCollection[2].photoURL,
          },
          {
            uid: userCollection[3].uid,
            name: userCollection[3].displayName,
            photoURL: userCollection[3].photoURL,
          },
          {
            uid: userCollection[4].uid,
            name: userCollection[4].displayName,
            photoURL: userCollection[4].photoURL,
          },
        ],
        groupJoinPendingRequests: [
          {
            uid: userCollection[5].uid,
            name: userCollection[5].displayName,
            photoURL: userCollection[5].photoURL,
          },
        ],
        groupPosts: [
          {
            type: 'text',
            nbLikes: 100,
            nbComments: 100,
            datetime: new Date().toISOString(),
            uid: userCollection[0].uid,
            photoURL: userCollection[0].photoURL,
            username: userCollection[0].displayName,
            text: 'Content of this post is censored',
            groupPostVotes: [{ uid: userCollection[0].uid, responseIndex: 0 }],
            groupPostComments: [
              {
                uid: userCollection[1].uid,
                username: userCollection[1].displayName,
                datetime: new Date().toISOString(),
                text: 'Great comment #1',
              },
              {
                uid: userCollection[1].uid,
                username: userCollection[1].displayName,
                datetime: new Date().toISOString(),
                text: 'Great comment #2',
              },
            ],
            groupPostLikes: [userCollection[0].uid, userCollection[1].uid],
          },
        ],
      }),
    ])
    console.log('Groups generated')
  } catch (err) {
    console.log(err)
  }
}

// Init
;(async function init() {
  console.log('Starting initialization of local test database.')

  try {
    // Steps
    console.log('Initializing test users ...')
    await fillAuth()
    console.log('Initializing test Followers ...')
    await fillFollowers()
    console.log('Initializing test Groups ...')
    await fillGroups()

    console.log('Database successfully filled, server listening ...')
    // Manually ending script
    // process.exit(0)
  } catch (err) {
    console.log('The following error occured', err)
  }
})()
