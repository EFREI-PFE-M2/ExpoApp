import firebase from 'firebase'
import Constants from 'expo-constants'

const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENTID,
} = Constants.manifest.extra

// Initialize Firebase
if (firebase.app.length) {
  firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENTID,
  })
  // if (__DEV__) {
  //   firebase.auth().useEmulator('http://192.168.1.105:9099')
  //   firebase.firestore().useEmulator('http://192.168.1.105:8080')
  //   firebase.functions().useEmulator('localhost', 5001)
  // }
}

export const FirebaseApp: firebase.app.App = firebase.app()
export const FirebaseAuth: firebase.auth.Auth = firebase.auth()
export const FirebaseFirestore: firebase.firestore.Firestore = firebase.firestore()
export const FirebaseFunctions: firebase.functions.Functions = firebase.functions()
export const FirebaseMessaging: firebase.messaging.Messaging = firebase.messaging()
