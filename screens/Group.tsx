import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { Text, View } from './../components/Themed'

const PUBLIC = 'public'
const PRIVE = 'privé'

const Tab = createMaterialTopTabNavigator()

export default function Group({ route, navigation }) {
  const { groupID } = route.params
  const { name, photoURL, private: isPrivate, nbMembers } = useSelector(
    (state) => state.group?.groups[groupID]
  )

  const goBack = () => navigation.goBack()

  navigation.setOptions({
    headerLeft: ({ tintColor }) => (
      <IconButton
        icon="chevron-left"
        size={30}
        color={tintColor}
        onPress={goBack}
      />
    ),
    headerRight: ({ tintColor }) => (
      <IconButton icon="dots-horizontal" size={24} color={tintColor} />
    ),
  })

  return (
    <View style={styles.container}>
      <View style={styles.groupInfoContainer}>
        <Image
          source={{ uri: photoURL }}
          style={styles.photoURL}
          resizeMode="cover"
        />
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.content}>{`Groupe ${
          isPrivate ? PRIVE : PUBLIC
        } - ${nbMembers} membres`}</Text>
      </View>
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#194A4C',
          },
          indicatorStyle: {
            backgroundColor: '#194A4C',
          },
          showLabel: true,
          showIcon: true,
          tabStyle: {
            flexDirection: 'row',
          },
        }}>
        <Tab.Screen name="Posts" component={Posts} />
        <Tab.Screen name="Membres" component={Members} />
        <Tab.Screen name="Requêtes" component={Request} />
      </Tab.Navigator>
    </View>
  )
}

function Posts() {
  return (
    <View>
      <Text>POSTS</Text>
    </View>
  )
}

function Members() {
  return (
    <View>
      <Text>Members</Text>
    </View>
  )
}

function Request() {
  return (
    <View>
      <Text>Requetes</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  groupInfoContainer: {
    flexDirection: 'column',
    height: 180,
    marginHorizontal: 15,
  },
  photoURL: {
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    fontWeight: '500',
  },
})
