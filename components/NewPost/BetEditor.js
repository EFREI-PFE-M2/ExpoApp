import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import RNPickerSelect from 'react-native-picker-select';
import { IconButton } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons';
import {
  setText,
  setBetData,
  setImage,
  setSurvey
} from './../../store/postEditorSlice';
import { useDispatch, useSelector } from 'react-redux'

export default function BetEditor({ route, navigation }) {
  const { race } = route.params

  const dispatch = useDispatch()

  const [betType, setBetType] = React.useState('simple')
  const [betCategory, setBetCategory] = React.useState('placé')
  const [bet, setBet] = React.useState([-1, -1, -1, -1, -1])

  const [sufficientSelection, setSufficientSelection] = React.useState()

  useEffect(()=>{
    let nbSelection = bet.filter((id)=> id > -1 && id != null).length
    switch(betType){
        case 'simple':
            if(nbSelection === 1)
                setSufficientSelection(true)
            else
                setSufficientSelection(false)
            break;
        case 'couplé':
            if(nbSelection === 2)
                setSufficientSelection(true)
            else
                setSufficientSelection(false)
            break;
        case 'quinté':
            if(nbSelection === 5)
                setSufficientSelection(true)
            else
                setSufficientSelection(false)
            break;
    }
  }, bet)

  const selectBetType = (betType) => {
    setBetType(betType)
    switch(betType){
        case 'simple':
            setBetCategory('placé')
            setBet([-1, -1, -1, -1, -1])
            break;
        case 'couplé':
            setBetCategory('placé')
            setBet([-1, -1, -1, -1, -1])
            break;
        case 'quinté':
            setBetCategory('ordre')
            setBet([-1, -1, -1, -1, -1])
            break;
    }
    
  }

  const onBetChange = (index, id) => {
    setBet((prevState)=> prevState.map((prevHorseID, prevBetIndex)=> prevBetIndex === index ? id : prevHorseID))
  }

  const submitToPost = () => {
    let betData = {
      raceCode: race.raceCode,
      locationCode: race.locationCode,
      title: race.raceTitle,
      raceCategory: race.category,
      distance: race.distance,
      nbContenders: race.horses.length,
      location: race.location,
      raceDate: race.date,
      betType: betType,
      category: betCategory,
      bet: bet.filter((value)=> value > -1),
      raceID: race.id,
      betResults: []
    }
    dispatch(setImage(null))
    dispatch(setSurvey(null))
    dispatch(setText(`Voici mon pari sur ${race.raceCode} - ${race.locationCode}`))
    dispatch(setBetData(betData))

    navigation.navigate('Post_Editor');
  }

  return (
    <View style={{ flexDirection: 'column', flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <IconButton
            icon="chevron-left"
            onPress={() => navigation.goBack()}
            size={30}
            color="#fff"
          />
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            Pronostic sur {race.raceCode} {race.locationCode}
          </Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      <ScrollView style={{ flexDirection: 'column', margin: 20 }}>
        <Text style={{ color: '#757575', fontSize: 18 }}>Type de pari</Text>
        <View
          style={styles.picker}>
            <RNPickerSelect
                    value={betType}
                    onValueChange={(value) => selectBetType(value)}
                    Icon={() => {
                        return <Ionicons name="ios-arrow-down" size={24} color="gray" />
                    }}
                    items={[
                        { label: 'Simple', value: 'simple' },
                        { label: 'Couplé', value: 'couplé' },
                        { label: 'Quinté', value: 'quinté' },
                    ]}
                />
        </View>
        <Text style={{ color: '#757575', fontSize: 18, marginTop: 15 }}>
          Catégorie
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
          }}>
          {(betType === 'simple' || betType === 'couplé') && (
            <>
              <TouchableOpacity
                onPress={() => setBetCategory('placé')}
                style={[
                  betCategory === 'placé'
                    ? styles.toggleButtonSelected
                    : styles.toggleButton,
                  { marginRight: 10 },
                ]}>
                <Text
                  style={
                    betCategory === 'placé'
                      ? styles.toggleButtonTextSelected
                      : styles.toggleButtonText
                  }>
                  Placé
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setBetCategory('gagnant')}
                style={[
                  betCategory === 'gagnant'
                    ? styles.toggleButtonSelected
                    : styles.toggleButton,
                  { marginRight: 10 },
                ]}>
                <Text
                  style={
                    betCategory === 'gagnant'
                      ? styles.toggleButtonTextSelected
                      : styles.toggleButtonText
                  }>
                  Gagnant
                </Text>
              </TouchableOpacity>
            </>
          )}
          {(betType === 'couplé' || betType === 'quinté') && (
            <>
              <TouchableOpacity
                onPress={() => setBetCategory('ordre')}
                style={[
                  betCategory === 'ordre'
                    ? styles.toggleButtonSelected
                    : styles.toggleButton,
                  { marginRight: 10 },
                ]}>
                <Text
                  style={
                    betCategory === 'ordre'
                      ? styles.toggleButtonTextSelected
                      : styles.toggleButtonText
                  }>
                  Ordre
                </Text>
              </TouchableOpacity>
            </>
          )}
          {betType === 'quinté' && (
            <TouchableOpacity
              onPress={() => setBetCategory('désordre')}
              style={[
                betCategory === 'désordre'
                  ? styles.toggleButtonSelected
                  : styles.toggleButton,
                { marginRight: 10 },
              ]}>
              <Text
                style={
                  betCategory === 'désordre'
                    ? styles.toggleButtonTextSelected
                    : styles.toggleButtonText
                }>
                Désordre
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ marginTop: 10 }}>
          <Desc betType={betType} betCategory={betCategory} />
        </View>
        <Text style={{ color: '#757575', fontSize: 18, marginTop: 15 }}>
          Sélection de chevaux
        </Text>
        <HorseFields betType={betType} horses={race.horses} bet={bet} onBetChange={onBetChange}/>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row-reverse',
          borderWidth: 1,
          borderColor: '#D6D6D6',
          borderStyle: 'solid',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <TouchableOpacity onPress={submitToPost} disabled={!sufficientSelection || !betType}>
          <Text style={sufficientSelection && betType ? { color: '#194A4C', fontWeight: 'bold' }:
         { color: '#C6C2C2', fontWeight: 'bold' }
         }>
            Ajouter au post
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function HorseFields(props){
    let {betType, horses, bet, onBetChange} = props
    let nbChoices = 0;
    switch(betType){
        case 'simple':
            nbChoices = 1
            break;
        case 'couplé':
            nbChoices = 2
            break;
        case 'quinté':
            nbChoices = 5
            break;
    }   
    return (
        [...Array(nbChoices).keys()].map((slotIndex)=>(
            <View style={styles.picker} key={slotIndex}>
                    <RNPickerSelect
                            value={bet[slotIndex]}
                            onValueChange={(horseID) => {
                                if(horseID != bet[slotIndex] && !bet.includes(horseID)){
                                    onBetChange(slotIndex, horseID)
                                }
                            }}
                            Icon={() => {
                                return <Ionicons name="ios-arrow-down" size={24} color="gray" />
                            }}
                            items={horses.map((name, index)=>({label: `${index} • ${name}`, value: index}))}
                        />
            </View>
        ))
    )
}

function Desc(props){
    let {betType, betCategory} = props
    let text;
    switch(betType){
        case 'simple':
            switch(betCategory){
                case 'placé':
                    text = "Vous gagnez si vous trouvez l'un des 3 premiers chevaux de l'arrivée"
                    break; 
                case 'gagnant':
                    text = "Il faut trouver le premier cheval de la course. Si ce cheval fait écurie avec d'autres chevaux, les paris simples gagnants engagés sur ses autres chevaux donnent droit aussi au même rapport simple gagnant"
                    break; 
            }
            break;
        case 'couplé':
            switch(betCategory){
                case 'placé':
                    text = "Trouvez 2 des 3 premiers chevaux, quel que soit l'ordre"
                    break; 
                case 'gagnant':
                    text = "Votre pari sera gagnant si vous avez trouvé les 2 premiers chevaux quel que soit l'ordre"
                    break; 
                case 'ordre':
                    text = "Votre pari sera gagnant si vous avez trouvé les 2 premiers chevaux dans l'ordre"
                    break;
            }
            break;
        case 'quinté':
            switch(betCategory){
                case 'ordre':
                    text = "Lister les cinq chevaux arrivés en tête de la course dans l’ordre"
                    break; 
                case 'désordre':
                    text = "Lister les cinq chevaux arrivés en tête de la course dans l’ordre ou dans le désordre"
                    break; 
            }
            break;
    }   
    return (
        <Text style={{color: '#757575', fontSize: 12}}>{text}</Text>
    )
}



const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: '#194A4C',
    flexDirection: 'row',
    alignItems: 'center',
  },
  betTypeImage: {
    width: 85,
    height: 30,
    marginRight: 2,
  },
  toggleButton: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderColor: '#757575'
  },
  toggleButtonSelected: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: '#194A4C',
    borderColor: 'transparent'
  },
  toggleButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold'
  },
  toggleButtonText: {
    color: '#757575',
  },
  picker: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderStyle: 'solid',
    borderRadius: 10,
    flex: 1, 
    paddingHorizontal: 10, 
    paddingVertical: 10
  }
})
