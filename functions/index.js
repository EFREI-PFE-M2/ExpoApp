const functions = require('firebase-functions')
const data = require('./weekRaces')
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
  .https.onRequest((request, response) => {
    let dateParameter = request.query.date
    if(dateParameter){
      let date = new Date(dateParameter)
      let dayID = date.getDay()
      let dayRaces = data.races.filter((race)=>race.weekDayID === dayID)
      .map((race=> ({...race, date: `${dateParameter} ${race.hour}` })))
      response.send(dayRaces)
    }else{
      response.send('date parameter undefined')
    }
  })