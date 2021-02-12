import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { Text, View } from './Themed'

export default function GroupCard({ groupID }) {
  const { name, picture } = useSelector(
    (state) => state.group?.groups[groupID]
  )
  const { navigate } = useNavigation()

  const onPress = () => navigate('Home_Group', { groupID })

  return (
    <TouchableRipple style={styles.container} onPress={onPress}>
      <>
        <Image source={{ uri: picture }} style={styles.image} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text>Publication il y a 3 jours</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#000" />
      </>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: { height: 75, width: 100, marginLeft: 10 },
})
