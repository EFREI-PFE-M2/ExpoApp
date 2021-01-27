import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import store from './store'
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper'
import { LogBox } from 'react-native';

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'
import { Theme } from 'react-native-paper/lib/typescript/src/types'
import { autoAuth } from './store/userSlice'

const theme: Theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: '#fff',
    accent: '#194A4C',
    placeholder: '#ffffff',
    background: '#ffffff18',
    text: '#fff',
  },
}

store.dispatch(autoAuth())

export default function App() {
  LogBox.ignoreLogs(['Setting a timer']);
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete || store.getState().user.uid) {
    return null
  } else {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <StatusBar />
            <Navigation colorScheme={colorScheme} />
          </SafeAreaProvider>
        </PaperProvider>
      </Provider>
    )
  }
}
