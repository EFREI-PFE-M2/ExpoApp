import React from 'react'
import { StyleSheet } from 'react-native'
import { Avatar, ProgressBar } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/userSlice'
import { View, Text } from '../Themed'

export default function ProfileCard() {
  const { username, photoURL, level, nbFollowers, nbFollowing } = useSelector(
    selectCurrentUser
  )

  return (
    <View style={styles.container}>
      <HorizontalView>
        <Avatar.Image source={{ uri: photoURL }} size={56} />
        <VerticalView>
          <Text style={styles.title}>{username}</Text>
          <Text style={styles.level}>Niveau {level}</Text>
          <ProgressBar
            progress={0.5}
            color="#194A4C"
            style={styles.progressBar}
          />
        </VerticalView>
      </HorizontalView>
      <View style={styles.followerSection}>
        <Text>{nbFollowers} Abonnés</Text>
        <Text>{nbFollowing} Abonnements</Text>
      </View>
    </View>
  )
}

const HorizontalView = ({ children }) => (
  <View style={styles.horizontalView}>{children}</View>
)

const VerticalView = ({ children }) => (
  <View style={styles.verticalView}>{children}</View>
)

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#194A4C',
  },
  progressBar: {
    height: 12,
    borderRadius: 20,
  },
  horizontalView: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  verticalView: {
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 5,
    marginVertical: 5,
  },
  level: {
    textAlign: 'right',
    color: '#B21F3A',
  },
  followerSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})
