import {
    createSlice,
    Dispatch,
    PayloadAction,
    Reducer,
    Slice,
  } from '@reduxjs/toolkit'
  import { RootState } from '.'
  import { FirebaseApp as firebase, FirebaseAuth as auth } from '../firebase'
  import { User, UserStore } from '../types'

  /*const defaultUser: Message = {
    uid: '',
    username: '',
    email: '',
    photoURL: '',
    emailVerified: undefined,
    notificationSettings: new Map(),
    description: '',
    winPercentage: 0,
    lossPercentage: 0,
    canceledPercentage: 0,
    returnOnInvestment: 0,
    currentSeries: [],
    showStats: false,
    level: 0,
    experience: 0,
    nbFollowers: 0,
    nbFollowing: 0,
  }
  
  const defaultUsers: UserStore = {
    users: {},
    current: '',
  }*/