import React, { useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Text, View } from '../components/Themed'
import { Badge, IconButton } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { selectSpecificRace, updateSpecificRacePosts } from '../store/raceSlice'
import { FlatList, StyleSheet, Image } from 'react-native';
import Post from '../components/Post'


export default function Race({ route, navigation }) {

  const race = useSelector(selectSpecificRace);
  const dispatch = useDispatch()


  const { raceID } = route.params
  const {
    allocation,
    category,
    distance,
    location,
    raceCode,
    nbContenders,
    raceTitle,
    direction,
    field,
    equidiaPronostic,
    locationCode,
  } = race

  useEffect(() => {
    dispatch(updateSpecificRacePosts(raceID))
  }, [])

  const goBack = () => navigation.goBack()

  navigation.setOptions({
    headerRight: null,
    headerLeft: ({ color }) => (
      <IconButton
        icon="chevron-left"
        size={36}
        color={color}
        onPress={goBack}
      />
    ),
  })

  return (
    <ScrollView>
      <View>
        <Text
          style={[
            styles.title,
            { color: '#757575' },
          ]}>{`${raceCode} ${location}`}</Text>
        <Text style={styles.title}>{`${locationCode} ${raceTitle}`}</Text>
      </View>

      <Container>
        <Column>
          <TitleText>Discipline</TitleText>
          <BaseText>{category}</BaseText>
        </Column>
        <Column>
          <TitleText>Distance</TitleText>
          <BaseText>{`${allocation}m`}</BaseText>
        </Column>
        <Column>
          <TitleText>Partans</TitleText>
          <BaseText>{nbContenders}</BaseText>
        </Column>
        <Column>
          <TitleText>Allocation</TitleText>
          <BaseText>{`${allocation}€`}</BaseText>
        </Column>
      </Container>
      <Container>
        <Column>
          <TitleText>Corde</TitleText>
          <BaseText>{direction}</BaseText>
        </Column>
        <Column>
          <TitleText>Terrain</TitleText>
          <BaseText>{field}</BaseText>
        </Column>
      </Container>
      <View style={styles.prono}>
        <Image source={require('./../assets/images/equidia.png')} />
        <View style={{ flexDirection: 'row' }}>
          {equidiaPronostic.map((element, key) => (
            <Badge size={24} style={styles.badge} key={key}>
              {element}
            </Badge>
          ))}
        </View>
      </View>

      <View style={styles.pubs}>
        <Text>Publications</Text>
        <Text>Actualiser</Text>        
      </View>
      <View>
        {
          race.posts && race.posts.length > 0 &&
          <FlatList
            data={race.posts}
            renderItem={({item}) => 
              <Post 
                photoURL={item.profilePicture}
                username={item.displayName} date={item.datetime} nbLikes={item.nbLikes} nbComments={item.nbComments}
                text={item.text}
              />
            }
          />
        }
      </View>
    </ScrollView>
  )
}

function Container({ children, style, ...rest }) {
  return <View style={[styles.ViewContainer, style]}>{children}</View>
}

function Column({ children, ...rest }) {
  return (
    <View style={styles.ViewColumn} {...rest}>
      {children}
    </View>
  )
}

function BaseText({ children, style, ...rest }) {
  return (
    <Text style={[styles.TextColumn, style]} {...rest}>
      {children}
    </Text>
  )
}

function TitleText({ children, style, ...rest }) {
  return (
    <Text style={[styles.TitleColumn, style]} {...rest}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  prono: {
    borderWidth: 1,
    borderColor: '#D6D6D6',
    width: '100%',
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#194A4C',
    fontSize: 26,
    fontWeight: 'bold',
    fontStyle: 'italic',
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  pubs: {
    width: '100%',
    backgroundColor: '#fff0',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  ViewColumn: {
    flexDirection: 'column',
    marginRight: 20,
  },
  TextColumn: {
    fontSize: 14,
    color: '#194A4C',
  },
  TitleColumn: {
    fontSize: 16,
    color: '#757575',
  },
  ViewContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  badge: {
    backgroundColor: '#194A4C',
    marginLeft: 10,
    fontWeight: 'bold',
  },
})
