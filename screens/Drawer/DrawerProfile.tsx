import React, { ReactPropTypes } from 'react'
import { StyleSheet } from 'react-native'
import { Avatar } from 'react-native-paper'
import { useSelector } from 'react-redux'
import ProfilePhoto from '../../components/ProfilePhoto'
import { View, Text } from '../../components/Themed'
import { selectCurrentUser } from '../../store/userSlice'

export default function DrawerProfile() {
  const user = useSelector(selectCurrentUser)

  const { username, photoURL, nbFollowing, nbFollowers } = user

  return (
    <View style={styles.container}>
      <Avatar.Image source={{  uri: photoURL  }} size={48} />
      <Text style={styles.title}>{username}</Text>
      <View style={styles.folllowContainer}>
        <Text style={styles.followLabel}>
          <Text style={styles.number}>{nbFollowing}</Text> Abonnements
        </Text>
        <Text style={styles.followLabel}>
          <Text style={styles.number}>{nbFollowers}</Text> Abonnés
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff0',
    paddingHorizontal: 25,
  },
  folllowContainer: {
    backgroundColor: '#fff0',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  followLabel: {
    fontSize: 12,
    color: '#fff',
  },
  number: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
  },
})