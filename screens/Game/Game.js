import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import { IconButton, Modal, Portal } from 'react-native-paper'
import { Button } from 'react-native-paper';
import CardPreview from '../../components/CardPreview'
import Card from '../../components/Card'
import CardResult from '../../components/CardResult'
import { useDispatch, useSelector } from 'react-redux'
import { simulatorStartGame, simulatorEndGame, simulatorCurrentUserTurn } from '../../store/cardGameSlice'
import { selectCurrentUser } from '../../store/userSlice'

const testCard = {
    cardDescription: "finished second to Affirmed in all three 1978 Triple Crown races",
    cardName: "Foudre",
    cardPicture: "https://firebasestorage.googleapis.com/v0/b/pmu-commu.appspot.com/o/cards%2Fhorse9.jpg?alt=media&token=dfa22774-f182-486f-9981-e20fccdfb4dc",
    cardRarity: 3,
    corde_droite: 52,
    corde_gauche: 3,
    herbe: 38,
    psf: 69
}


export default function Game({ route, navigation }) {
  
  const game = useSelector((state)=> state.cardGame);
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(simulatorStartGame())
  },[])

  useEffect(()=>{
    if(game.turnUser2ChosenCaracteristicTitle && game.turnUser2ChosenCaracteristicScore
        && !showFront){
        setShowFront(true)
    }
  },[game.turnUser2ChosenCaracteristicTitle, game.turnUser2ChosenCaracteristicScore])
  
  const [quitModalVisible, setQuitModalVisible] = useState(false)
  

  const [showFront, setShowFront] = useState(false)

  const chooseCaracteristic = (caracKey) => {
    dispatch(simulatorCurrentUserTurn(caracKey))
  }

  return (
    <SafeAreaView style={{ flexDirection: 'column', flex: 1, backgroundColor: '#194A4C' }}>
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
                            dispatch(simulatorEndGame())
                        }}>
                            Quitter
                        </Button>
                    </View>
                </View>
            </View>
          </Modal>
        </Portal>
        {
            game.state !== "game_results" &&
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
            game.state === "loading" && 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{alignItems: 'center'}}>
                    <Image source={require('../../assets/images/loading_horse.gif')}  style={{width: 72, height: 47}} />
                    <Text style={{color: '#fff'}}>Recherche d'un joueur adverse...</Text>
                </View>
            </View>
        }
        {
            game.state === "attempt" && 
            <View style={{flex: 1}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    {
                        game.turnUserID !== currentUser.uid ?
                        <Card 
                            rotateOnPress={false} 
                            chooseLineOnPress={false}
                            initialFaceIsFront={false}
                            showFront={showFront}
                            picture={game.turnUser1CardPicture}
                            title={game.turnUser1CardTitle}
                            desc={game.turnUser1CardDesc}
                            rarity={game.turnUser1CardRarity}
                            caracteristics={game.turnUser1CardCaracteristics}
                        />
                        :
                        <Card 
                            rotateOnPress={false} 
                            chooseLineOnPress={true}
                            chooseCaracteristic={chooseCaracteristic}
                            initialFaceIsFront={true}
                            showFront={showFront}
                            picture={game.turnUser1CardPicture}
                            title={game.turnUser1CardTitle}
                            desc={game.turnUser1CardDesc}
                            rarity={game.turnUser1CardRarity}
                            caracteristics={game.turnUser1CardCaracteristics}
                        />
                    }
                    

                </View>
            </View>
        }
        {
            game.state === "turn_results" && 
            <View style={{flex: 1}}>
                <View style={{alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}>
                        {game.turnWinnerID === currentUser.uid ?  'Vous avez gagné le tour !' : 'Vous avez perdu le tour !'}
                    </Text>
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <CardResult
                        caracteristic={game.turnUser2ChosenCaracteristicTitle}
                        score={game.turnUser2ChosenCaracteristicScore} 
                        name={game.turnUser2CardTitle} 
                        win={game.turnWinnerID === game.user2ID}
                        cardPicture={game.turnUser2CardPicture}
                        userPicture={game.user2ProfilePicture}
                    />
                    <CardResult
                        caracteristic={game.turnUser1ChosenCaracteristicTitle} 
                        score={game.turnUser1ChosenCaracteristicScore}
                        name={game.turnUser1CardTitle} 
                        win={game.turnWinnerID === currentUser.uid} 
                        cardPicture={game.turnUser1CardPicture}
                        userPicture={currentUser.photoURL}
                    />
                </View>
            </View>
        }
        {
            (game.state === "turn_results" || game.state === "attempt") &&
            <View style={{backgroundColor: '#fff', 
                paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-around'}}>
                    {
                      game.state === "attempt" &&
                      <Text style={{fontSize: 20}}>{
                        game.turnUserID !== currentUser.uid ? 
                        `Au tour de ${game.user2Username}...` : 'Choisissez une ligne...'
                      }</Text>

                    }
                    
                    <Text style={{fontSize: 20}}>{`${game.user1Score + game.user2Score + 1}/5`}</Text>
            </View>
        }
        {
            game.state === "game_results" && 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{alignItems: 'center'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>Vous avez</Text>
                            {game.winnerID === currentUser.uid ? 
                                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', color: '#53EC7E'}}> gagné </Text>
                            :
                                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', color: '#EC5353'}}> perdu </Text>
                            }
                        <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>la partie {
                            game.winnerID === currentUser.uid ?
                            `${game.user1Score} - ${game.user2Score}`
                            :
                            `${game.user2Score} - ${game.user1Score}`
                        }</Text>
                    </View>
                    {game.winnerID === currentUser.uid && <Image source={require('../../assets/images/medal.png')}  style={{width: 70, height: 70}}/>}
                    <Text style={{margin: 10, color: '#8CA4A5'}}>
                        {game.winnerID === currentUser.uid ? 'Vous remportez:' : 'Vous remportez quand même:'}
                    </Text>
                    <Text style={{margin: 10, color: '#fff', fontSize: 30}}>{game.winnerID === currentUser.uid ?
                        game.winnerXpWon
                    :
                        game.looserXpWon
                    } xp</Text>
                    {game.winnerID === currentUser.uid && 
                    (
                        <>
                            <Text style={{margin: 10, color: '#8CA4A5'}}>+</Text>
                            <View style={{margin: 10, backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10}}>
                            <CardPreview cardPicture={game.winnerCardPicture} cardName={game.winnerCardName} cardRarity={game.winnerCardRarity}/>
                            </View>
                        </>
                    )
                    }
                    <TouchableOpacity 
                    onPress={()=>{
                        navigation.goBack()
                        dispatch(simulatorEndGame())
                    }}
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
    </SafeAreaView>
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