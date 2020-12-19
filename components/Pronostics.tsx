import React from 'react'
import { StyleSheet } from 'react-native'
import { Badge, IconButton } from 'react-native-paper'
import useRaceType from '../hooks/useRaceType'
import { View, Text } from './Themed'

const BACKGROUND_COLOR = '#194A4C'

export default function Pronostics({ betID, userID, edit }) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <RaceCodeRender code="R2 C1" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Prix Citeos</Text>
          <Text style={styles.info}>Plat - 22 Aout 14:30</Text>
        </View>
      </View>
      <PronoSection
        type="quinte"
        list={[1, 2, 3, 4, 5]}
        result={[1, 6, 3, 4, 9]}
      />
      {edit ? (
        <View>
          <IconButton icon="cancel" size={30} color="#fff" />
          <IconButton icon="pen" size={30} color="#fff" />
        </View>
      ) : (
        <View />
      )}
      <View style={styles.resultContainer}>
        <Text style={styles.result}>Perdu</Text>
      </View>
    </View>
  )
}

function RaceCodeRender({ code }) {
  const codeParts = code?.split(' ')
  return (
    <View style={raceCodeStyles.container}>
      <Text style={raceCodeStyles.code}>{codeParts[0]}</Text>
      <Text style={raceCodeStyles.code}>{codeParts[1]}</Text>
    </View>
  )
}

function PronoSection({ type, result, list }) {
  const Logo = useRaceType(type)
  return (
    <View style={pronoStyles.container}>
      <Logo />
      {list?.map((element) => {
        const backgroundColor = result.includes(element) ? '#53EC7E' : '#EC5353'
        return (
          <Badge style={[pronoStyles.badge, { backgroundColor }]} size={24}>
            {element}
          </Badge>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    height: 90,
    flexDirection: 'column',
    paddingTop: 5,
    paddingLeft: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff0',
  },
  title: {
    fontSize: 24,
    color: '#fff',
  },
  info: {
    color: '#fff',
    opacity: 0.5,
    fontSize: 10,
  },
  textContainer: {
    backgroundColor: '#fff0',
    marginLeft: 15,
  },
  resultContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#EC5353',
    height: 24,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  result: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
})

const raceCodeStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#0000004D',
    width: 30,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  code: {
    color: '#fff',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
})

const pronoStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff0',
  },
  badge: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
})
