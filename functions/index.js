const functions = require('firebase-functions')

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
// Note: default deploy region is us-central-1, always specify to europe-west-1

exports.helloWorld = functions
  .region('europe-west1')
  .https.onRequest((request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true })
    response.send('Hello from Firebase!')
  })
