import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import { updateCards, selectCards, selectCardsLoading } from '../../store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import CardPreview from '../../components/CardPreview'

export default function GameDeck() {
  const dispatch = useDispatch()
  const cards = useSelector(selectCards)
  const cardsLoading = useSelector(selectCardsLoading)

  useEffect(()=>{
    dispatch(updateCards())
  },[])

  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <View style={{flexDirection: 'row-reverse', alignItems: 'center', margin: 5}}>
          <TouchableOpacity onPress={()=>dispatch(updateCards())}>
              <Text style={{color: '#757575'}}>Actualiser</Text>
          </TouchableOpacity>  
      </View>
      {cardsLoading &&
        <View style={styles.loadingGif}>
          <Image source={require('../../assets/images/loading_horse_green.gif')}  style={{width: 72, height: 47}} />
          <Text>Chargement...</Text>
        </View>
      }
      <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1}}>
        {
          cards && cards.map((card, index)=>
              <TouchableOpacity key={index} onPress={()=>{}}>
                <CardPreview cardPicture={card.cardPicture} cardName={card.cardName} cardRarity={card.cardRarity}/>
              </TouchableOpacity>
          )
        }
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  infoLine: {
    width: '100%',
    backgroundColor: '#fff0',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  loadingGif: {
    flex: 1,
    alignItems: 'center',
    height: 50,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  }
})