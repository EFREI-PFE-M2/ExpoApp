import React from 'react'
import Pronostics from '../../components/Pronostics'
import { View } from '../../components/Themed'

export default function HomeSubFeed() {
  return (
    <View>
      <Pronostics betID={1} userID={1} />
    </View>
  )
}
