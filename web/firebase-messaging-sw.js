importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-messaging.js')
importScripts('https://www.gstatic.com/firebasejs/7.22.1/firebase-analytics.js')

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const messaging = firebase.messaging()
