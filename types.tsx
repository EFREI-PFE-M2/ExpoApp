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
  notificationSettings: Map<string, boolean>
  description: string
  winPercentage: number
  lossPercentage: number
  canceledPercentage: number
  returnOnInvestment: number
  currentSeries: string[]
  showStats: boolean
  level: number
  experience: number
  nbFollowers: number
  nbFollowing: number
}

export type UserStore = {
  users: {
    [key: string]: User
  }
  current: string
}
