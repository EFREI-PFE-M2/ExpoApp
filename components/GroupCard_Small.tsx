import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { View, Text } from './Themed'

export default function GroupCard({ group, navigate }) {
  const { picture, name, nbMembers, id } = group

  const redirect = () => navigate('Home_Group', { groupID: id })
  return (
    <TouchableRipple style={styles.container} onPress={redirect}>
      <>
        <Image source={{ uri: picture || '' }} style={styles.image} />
        <View>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.members}>{nbMembers} members</Text>
        </View>
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
  members: {
    fontSize: 16,
    color: '#757575',
  },
})