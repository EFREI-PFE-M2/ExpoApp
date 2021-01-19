import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { View, Text } from './Themed'

export default function UserRequestCard({ user }) {
  const { photoURL, displayName, id } = user
  const dispatch = useDispatch()

  const acceptRequest = () => dispatch(acceptRequest(id))

  const rejectRequest = () => dispatch(rejectRequest(id))

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoURL || '' }} style={styles.image} />
      <Text style={styles.title}>{displayName}</Text>
      <View style={styles.buttonGroup}>
        <IconButton
          icon="account-check"
          onPress={acceptRequest}
          color="#194A4C"
        />
        <IconButton icon="cancel" onPress={rejectRequest} color="#ff3333" />
      </View>
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
  buttonGroup: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
})
