export type RootStackParamList = {
  Root: undefined
  NotFound: undefined
}

export type BottomTabParamList = {
  TabOne: undefined
  TabTwo: undefined
}

export type TabOneParamList = {
  TabOneScreen: undefined
}

export type TabTwoParamList = {
  TabTwoScreen: undefined
}

export type User = {
  uid: string
  username: string
  email: string
  photoURL: string
  emailVerified: boolean | undefined
  winPercentage: number
  lossPercentage: number
  currentSeries: string[]
  showStats: boolean
  level: number
  experience: number
  nbFollowers: number
  nbFollowing: number,
  nbPendingMessages: Number,
  posts: [],
  notifications: [],
  cards: []
}

export type UserStore = {
  users: {
    [key: string]: User
  }
  current: string
}
