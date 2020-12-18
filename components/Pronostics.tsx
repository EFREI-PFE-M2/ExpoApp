import React from 'react'
import { StyleSheet } from 'react-native'
import { Badge, IconButton } from 'react-native-paper'
import { useSelector } from 'react-redux'
import useRaceType from '../hooks/useRaceType'
import { View, Text } from './Themed'
import moment from 'moment'

const BACKGROUND_COLOR = '#194A4C'

const resultState = {
  WIN: {
    color: '#53EC7E',
    label: 'Gagné',
  },
  LOSS: {
    color: '#EC5353',
    label: 'Perdu',
  },
  INPROGRESS: {
    color: '#000000AD',
    label: 'En cours',
  },
}

export default function Pronostics({ betID, userID, edit }) {
  // Those selectors should be replaced as a hook
  const { betRaceID, bet, betType } = useSelector(
    (state) => state.foreignUser[userID]?.userBets[betID]
  )
  const { raceTitle, category, results, datetime } = useSelector((state) =>
    state.race.races?.find((race) => race.id === betRaceID)
  )

  const compareBet = bet?.filter((element) => !results.includes(element))
  const betResult =
    results?.length !== 0
      ? compareBet?.length === 0
        ? resultState.WIN
        : resultState.LOSS
      : resultState.INPROGRESS
  const dateFormat = moment(Date.parse(datetime)).format('dddd Do YY - h:mm')

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <RaceCodeRender code="R2 C1" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{raceTitle}</Text>
          <Text style={styles.info}>{`${category} - ${dateFormat}`}</Text>
        </View>
      </View>
      <PronoSection type={betType} list={bet} result={results} />
      {edit ? (
        <View>
          <IconButton icon="cancel" size={30} color="#fff" />
          <IconButton icon="pen" size={30} color="#fff" />
        </View>
      ) : (
        <View />
      )}
      <View
        style={[styles.resultContainer, { backgroundColor: betResult.color }]}>
        <Text style={styles.result}>{betResult.label}</Text>
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
        const backgroundColor =
          result?.length !== 0
            ? result?.includes(element)
              ? resultState.WIN.color
              : resultState.LOSS.color
            : resultState.INPROGRESS.color
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
    borderRadius: 5,
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
    marginTop: 5,
  },
  badge: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
})
