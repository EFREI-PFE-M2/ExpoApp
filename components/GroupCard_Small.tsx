import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { getGroup } from '../store/groupSlice'
import { View, Text } from './Themed'

export default function GroupCard({ id, group, navigate }) {
  const { picture, name, nbMembers } = group
  const dispatch = useDispatch()



  const redirect = async () => {
    await dispatch(getGroup(id))
    navigate('Home_Group', { groupID: id })
  }
  return (
    <TouchableRipple style={styles.container} onPress={redirect}>
      <>
        <Image source={{ uri: picture }} style={styles.image} />
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
