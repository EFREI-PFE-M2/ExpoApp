import React from 'react'
import { StyleSheet } from 'react-native'
import { Avatar, Badge, ProgressBar } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/userSlice'
import { Text, View } from './../../components/Themed'

export default function Profile(props) {
  const { user, route } = props
  const displayUser = route.params.self ? useSelector(selectCurrentUser) : user
  const {
    uid,
    photoURL,
    username,
    level,
    experience,
    winPercentages,
    nbFollowers,
    nbFollowing,
  } = displayUser

  const renderXPCard = () => (
    <View style={XPCardStyles.container}>
      <View style={XPCardStyles.level}>
        <Text style={XPCardStyles.label}>Niveau</Text>
        <Badge size={24} style={XPCardStyles.badge}>
          {level}
        </Badge>
      </View>
      <ProgressBar progress={0.5} color="#194A4C" style={XPCardStyles.bar} />
    </View>
  )

  const renderUserInformation = () => (
    <View>
      <Text>{username}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={{ height: 100 }} />
      <View style={styles.banner}>
        <Avatar.Image source={{ uri: photoURL }} size={65} />
        {renderXPCard()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
})

const XPCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 5,
  },
  level: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#000',
  },
  bar: {
    width: 150,
  },
  badge: {
    backgroundColor: '#194A4C',
    marginLeft: 10,
  },
})
