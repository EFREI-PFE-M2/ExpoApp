import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import { IconButton, Modal, Portal } from 'react-native-paper'
import { Button } from 'react-native-paper';

export default function Game({ route, navigation }) {
  
  const [quitModalVisible, setQuitModalVisible] = useState(false)
  
  const [state, setState] = useState('game_results')

  const [turn, setTurn] = useState(2)
  const [isLineSelected, setIsLineSelected] = useState(true)
  const [oppenentUsername, setOppenentUsername] = useState('Jeff')

  const [isTurnWon, setIsTurnWon] = useState(false)

  const [isGameWon, setIsGameWon] = useState(true)
  const [currentUserScore, setCurrentUserScore] = useState(4)
  const [opponentScore, setOpponentScore] = useState(1)
  const [xpWon, setXpWon] = useState(20)
  const [cardWon, setCardWon] = useState(true)

  return (
    <View style={{ flexDirection: 'column', flex: 1, backgroundColor: '#194A4C' }}>
        <Portal>
          <Modal visible={quitModalVisible}>
            <View style={{ alignItems: 'center'}}>
                <View style={styles.modal}>
                    <Text style={{fontSize: 18}}>Êtes vous sûr de vouloir quitter ?</Text>
                    <Text style={{fontSize: 11, color: '#757575'}}>Votre adversaire gagnera si votre partie est lancée</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 10}}>
                        <Button mode="contained" style={{backgroundColor: '#757575'}}  labelStyle={{color: '#fff'}} onPress={() => setQuitModalVisible(false)}>
                            Annuler
                        </Button>
                        <Button mode="contained" style={{backgroundColor: '#194A4C'}} labelStyle={{color: '#fff'}}  onPress={() => {
                             setQuitModalVisible(false)
                            navigation.goBack()
                        }}>
                            Quitter
                        </Button>
                    </View>
                </View>
            </View>
          </Modal>
        </Portal>
        {
            state !== "game_results" &&
            <View style={[{flexDirection: 'row-reverse'}]}>
                <IconButton
                icon="window-close"
                onPress={() => setQuitModalVisible(true)}
                size={30}
                color="#fff"
                />
            </View>
        }
        {
            state === "loading" && 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{alignItems: 'center'}}>
                    <Image source={require('../../assets/images/loading_horse.gif')}  style={{width: 72, height: 47}} />
                    <Text style={{color: '#fff'}}>Recherche d'un joueur adverse...</Text>
                </View>
            </View>
        }
        {
            state === "attempt" && 
            <View style={{flex: 1}}>
                <View style={{flex: 1}}></View>
                <View style={{backgroundColor: '#fff', 
                paddingVertical: 30, flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Text style={{fontSize: 20}}>{isLineSelected ? `En attente de ${oppenentUsername}...` : 'Choisissez une ligne...'}</Text>
                    <Text style={{fontSize: 20}}>{`${turn}/5`}</Text>
                </View>
            </View>
        }
        {
            state === "turn_results" && 
            <View style={{flex: 1}}>
                <View style={{alignItems: 'center',}}>
                    <Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}>
                        {isTurnWon ?  'Vous avez gagné le tour !' : 'Vous avez perdu le tour !'}
                    </Text>
                </View>
                <View style={{flex: 1}}></View>
            </View>
        }
        {
            state === "game_results" && 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{alignItems: 'center'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>Vous avez</Text>
                            {isGameWon ? 
                                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', color: '#53EC7E'}}> gagné </Text>
                            :
                                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', color: '#EC5353'}}> perdu </Text>
                            }
                        <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>la partie {
                            isGameWon ?
                            `${currentUserScore} - ${opponentScore}`
                            :
                            `${opponentScore} - ${currentUserScore}`
                        }</Text>
                    </View>
                    {isGameWon && <Image source={require('../../assets/images/medal.png')}  style={{width: 70, height: 70}}/>}
                    <Text style={{margin: 10, color: '#8CA4A5'}}>
                        {isGameWon ? 'Vous remportez:' : 'Vous remportez quand même:'}
                    </Text>
                    {xpWon && <Text style={{margin: 10, color: '#fff', fontSize: 30}}>{xpWon} xp</Text>}
                    {cardWon && 
                    (
                        <>
                            <Text style={{margin: 10, color: '#8CA4A5'}}>+</Text>
                            <View style={{margin: 10, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10}}>
                                <Text>Card</Text>
                            </View>
                        </>
                    )
                    }
                    <TouchableOpacity 
                    onPress={()=>navigation.goBack()}
                    style={{backgroundColor: '#fff', marginTop: 20,borderRadius: 30, alignSelf: 'flex-start', 
                    paddingHorizontal: 10, paddingVertical: 10,
                    alignSelf: 'center',
                    flexDirection: 'row', alignItems: 'center'
                    }}>
                        <Text style={{color: '#194A4C', fontSize: 22, marginRight: 5}}>Quitter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        }
    </View>
  )
}


const styles = StyleSheet.create({
    modal: {
        borderRadius: 10,
        backgroundColor: '#fff', 
        paddingHorizontal: 10, 
        paddingVertical: 10
    }
})