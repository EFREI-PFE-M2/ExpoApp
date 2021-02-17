import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { useSelector } from 'react-redux'
import Navigation from '../navigation'
import { userSlice } from '../store/userSlice'
import { View, Text } from './Themed'
import { selectCurrentUser } from '../store/userSlice'
import { useNavigation } from '@react-navigation/native'

export default function UserCard({ user, navigate }) {
  const { photoURL, displayName, uid } = user

  const navigation = useNavigation()
  const currentUser = useSelector(selectCurrentUser);

  const onPress = () => navigation.navigate('Profil', {id: uid === currentUser.uid ? -1 : uid})
  return (
    <TouchableRipple style={styles.container} onPress={onPress}>
      <>
        <Image source={{ uri: photoURL || '' }} style={styles.image} />
        <Text style={styles.title}>{displayName}</Text>
      </>
    </TouchableRipple>
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