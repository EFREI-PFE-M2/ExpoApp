import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native'
import { IconButton } from 'react-native-paper'
import Card from '../components/Card'

export default function CardScreen({ route, navigation }) {

  const { cardData} = route.params
  return (
    <SafeAreaView style={{flex : 1, backgroundColor: '#194A4C'}}>
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
                    Carte
                </Text>
            </View>
            <View style={{ flex: 1 }}></View>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Card 
                rotateOnPress={true} 
                chooseLineOnPress={false}
                initialFaceIsFront={true}
                showFront={true}
                picture={cardData.cardPicture}
                title={cardData.cardName}
                desc={cardData.cardDescription}
                rarity={cardData.cardRarity}
                caracteristics={{
                    corde_droite: cardData.corde_droite,
                    corde_gauche: cardData.corde_gauche,
                    herbe: cardData.herbe,
                    psf: cardData.psf,
                }}
            />
        </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    header: {
        height: 70,
        backgroundColor: '#194A4C',
        flexDirection: 'row',
        alignItems: 'center',
    },
})

