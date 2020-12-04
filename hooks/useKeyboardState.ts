import { useState, useEffect } from 'react'
import { Keyboard } from 'react-native'

export default function useKeyboardState() {
  const [keyboardState, setKeyboardState] = useState(false)

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => setKeyboardState(false))
    Keyboard.addListener('keyboardDidShow', () => setKeyboardState(true))

    return () => {
      Keyboard.removeAllListeners('keyboardDidHide')
      Keyboard.removeAllListeners('keyboardDidShow')
    }
  }, [])

  return keyboardState
}
