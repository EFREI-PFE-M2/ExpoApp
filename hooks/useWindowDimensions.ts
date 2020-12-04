import { useState, useEffect } from 'react'
import { Dimensions } from 'react-native'

const InitialHeight = Dimensions.get('window').height

export const useWindowHeight = () => {
  const [height, setHeight] = useState(InitialHeight)

  const onChange = ({ window }) => setHeight(window.height)

  useEffect(() => {
    Dimensions.addEventListener('change', onChange)
    return () => {
      Dimensions.removeEventListener('change', onChange)
    }
  }, [])

  return height
}
