import React from 'react'
import { View, Image, StyleSheet, Text, Animated } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card as PaperCard } from 'react-native-paper';
import StarGroup from './StarGroup'

export default function Card(props) {

  let {cardPicture, cardName, cardRarity, cardDescription, corde_droite, corde_gauche, herbe, psf,
    selectCaracteristic} = props
  
  return (
    <PaperCard style={{width: 270}}>
        <PaperCard.Cover source={{ uri: cardPicture }} />
        <PaperCard.Content>
            <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 22}}>{cardName}</Text>
            </View>
            <StarGroup star={cardRarity}/>
            <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 10, color: '#757575'}}>{cardDescription}</Text>
            </View>
        </PaperCard.Content>
        <TouchableOpacity onPress={()=>selectCaracteristic('corde_gauche',corde_gauche)}>
            <View style={[styles.line, {backgroundColor: '#D6D6D6'}]}>
                    <Text style={{fontSize: 20}}>Corde gauche</Text>
                    <Text style={{fontSize: 20}}>{corde_gauche}</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>selectCaracteristic('corde_droite',corde_droite)}>
            <View style={[styles.line]}>
                    <Text style={{fontSize: 20}}>Corde droite</Text>
                    <Text style={{fontSize: 20}}>{corde_droite}</Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>selectCaracteristic('herbe',herbe)}>
            <View style={[styles.line, {backgroundColor: '#D6D6D6'}]}>
                    <Text style={{fontSize: 20}}>Herbe</Text>
                    <Text style={{fontSize: 20}}>{herbe}</Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>selectCaracteristic('psf',psf)}>
            <View style={[styles.line]}>
                    <Text style={{fontSize: 20}}>PSF</Text>
                    <Text style={{fontSize: 20}}>{psf}</Text>
            </View>
        </TouchableOpacity>

    </PaperCard>
  )
}

const styles = StyleSheet.create({
    line: {
        flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5,
        paddingHorizontal: 5
    }
})