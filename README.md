# ExpoApp

## Installation guide

The project uses Expo framework and is focused on developing a first testable POC.

Guide:

- Install Expo CLI on your PC with npm/yarn: `npm install --global expo-cli`
- Clone the project
- Use `yarn` or `npm install` command to install the dependencies
- Make sure you have the debugging device setup, if not follow the next section first
- Use `yarn start` or `npm start` to start the development server

To debug on your phone:

- Download the application Expo on [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) / [AppStore](https://search.itunes.apple.com/WebObjects/MZContentLink.woa/wa/link?path=apps%2fexponent)
- Create an account on [Expo.io](https://expo.io/)
- In the terminal login to your Expo account: `expo login`
- Start the development server

NOTE: if you do not want to run local firebase server, use expo production mode instead: [EXPO PRODUCTION](https://docs.expo.io/workflow/development-mode/)

## Local testing firebase emulators

Firebase emulators allows all the online serverless functions to be run locally, here is how to use it in this project.

Available services:

- Cloud functions
- Firestore
- Firebase auth
- Hosting

Tutorial:

- Make sure to `npm install` or `yarn`
- Use `npm run emulators` to run the local backend server
- Once the message `Database successfully filled, server listening ...` appears, go to `localhost:4000`
- Run the EXPO app `et voilà`
