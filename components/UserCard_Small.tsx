import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { View, Text } from './Themed'

export default function UserCard({ user }) {
  const { photoURL, displayName } = user
  return (
    <View style={styles.container}>
      <Image source={{ uri: photoURL || '' }} style={styles.image} />
      <Text style={styles.title}>{displayName}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    alignItems: 'center',
    paddingVertical: 10,
    height: 80,
    borderBottomColor: '#D6D6D6',
    borderBottomWidth: 1,
  },
  image: {
    width: 70,
    height: 50,
    marginRight: 25,
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
})
