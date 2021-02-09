import React from 'react'
import NewPost from '../../components/NewPost'
import { View } from '../../components/Themed'

export default function New() {
  return (
    <View style={{ height: '100%', width: '100%' }}>
      <NewPost isDialog />
    </View>
  )
}
