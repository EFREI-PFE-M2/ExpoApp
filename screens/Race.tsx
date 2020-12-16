import React from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { IconButton } from 'react-native-paper'
import { Text, View } from '../components/Themed'

export default function Race({ route, navigation }) {
  const { raceID } = route.params

  navigation.setOptions({})

  return (
    <ScrollView>
      <View>
        <Text style={styles.title}>R2 FEURS</Text>
        <Text style={styles.title}>C1 PRIX CITEOS</Text>
      </View>

      <Container>
        <Column>
          <TitleText>Discipline</TitleText>
          <BaseText>Plat</BaseText>
        </Column>
        <Column>
          <TitleText>Distance</TitleText>
          <BaseText>1850m</BaseText>
        </Column>
        <Column>
          <TitleText>Partans</TitleText>
          <BaseText>9</BaseText>
        </Column>
        <Column>
          <TitleText>Allocation</TitleText>
          <BaseText>11 000e</BaseText>
        </Column>
      </Container>
      <Container>
        <Column>
          <TitleText>Corde</TitleText>
          <BaseText>Corde a droite</BaseText>
        </Column>
        <Column>
          <TitleText>Terrain</TitleText>
          <BaseText>Piste en herbe</BaseText>
        </Column>
      </Container>
      <View style={styles.prono}></View>

      <View style={styles.pubs}>
        <Text>Publications</Text>
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
    width: '100%',
    height: 25,
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
    paddingTop: 5,
  },
})
