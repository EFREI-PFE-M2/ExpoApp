import React, {useRef, useEffect} from 'react'
import { View, Text} from './Themed'
import { StyleSheet, TouchableOpacity, FlatList, Linking, Image } from 'react-native'
import { Avatar, Divider, Button, Card } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'; 
import timeAgoFormat from '../utils/timeAgoFormatter'
import ProfileAvatar from './ProfileAvatar';

let currentDate = new Date()

const PMU_URL = 'https://www.pmu.fr/turf'

export default function Post(props) {

  let { post, currentUserID, handleLikePost } = props

  let { type, displayName, profilePicture, datetime, text, 
    nbLikes, nbComments, image, 
    nbCopiedBets, raceDate, locationCode, raceCode, 
    betType, title, category, raceCategory, 
    distance, nbContenders, 
    location, bet, raceID, betResults,
    responses, expirationDate, userVote, userID, won, alreadyLiked, id
  } = post || {}



  let strResponses = []
  let responseObjectList = [];
  let totalVotes = 0;

  if(type === "survey"){
    strResponses= Object.keys(responses)
    Object.keys(responses).forEach((response)=>{
      totalVotes += responses[response]
    })
    responseObjectList = Object.keys(responses).map((response, i) => {
      return {response: response, percentage: totalVotes !== 0 ?
        Math.round((responses[response]/totalVotes)*100) : 0}
    })
  }


  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <ProfileAvatar url={profilePicture}/>
          <View style={{margin: 5}}>
            <TouchableOpacity onPress={null}>
              <Text style={{ fontWeight: 'bold' }}>{displayName}</Text>
            </TouchableOpacity>
            <Text style={styles.date}>{timeAgoFormat(datetime)}</Text>
          </View>
        </View>
        <Text style={styles.postText}>{text}</Text>
        {
          type === "image" && (
            <Card>
              <Card.Cover source={{ uri: image }} />
            </Card>
          )
        }
        {
          type === "survey" && (
            <React.Fragment>
              {
                userVote || expirationDate < currentDate  || currentUserID === userID ?
                <FlatList
                  data={responseObjectList}
                  renderItem={({item, index}) => (
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <View style={[userVote === index ?{backgroundColor: "#759294"} : {backgroundColor: "#7D7D7D"},
                        { width: `${item.percentage}%`, 
                      height: 30, borderRadius: 15, marginBottom: 2}]} >
                      </View>
                      <View style={{position: 'absolute', flexDirection: 'row', backgroundColor: 'transparent', marginLeft: 5}}>
                            <Text style={{fontWeight: 'bold'}}>{`${item.percentage}%`} </Text>
                            <Text>{item.response}</Text>
                      </View>
                    </View>
                    
                  )}
                />
                :
                <FlatList
                  data={strResponses}
                  renderItem={({item}) => (
                    <Button style={{margin: 4}} mode="outlined" color="#194A4C" uppercase={false} onPress={() => console.log('Pressed')}>{item}</Button>
                  )}
                />
              }
              <Text style={{color: '#757575', margin: 4}}>{totalVotes} votes · termine {timeAgoFormat(expirationDate)}</Text>
            </React.Fragment>
          )
        }
        {
          type === "bet" && (
            <View style={{backgroundColor: '#194A4C', borderRadius:10}}>
              <View style={styles.betHeader}>
                <View style={styles.codeContainer}>
                  <Text style={styles.raceCode}>{raceCode}</Text>
                  <Text style={styles.raceCode}>{locationCode}</Text>
                </View>
                <View style={styles.betDesc}>
                  <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>{title}</Text>
                  <View style={{flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center', marginTop: 3}}>
                    <Text style={{color: '#C6D2D2', fontSize: 10}}>{raceCategory} • </Text>
                    <Text style={{color: '#C6D2D2', fontSize: 10}}>{distance}m • </Text>
                    <Text style={{color: '#C6D2D2', fontSize: 10}}>{nbContenders} partants</Text>
                  </View>
                  <View style={{flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center', marginTop: 3}}>
                    <MaterialIcons name="location-on" color="#C6D2D2" size={14} />
                    <Text style={{color: '#C6D2D2', fontSize: 10}}>{location}</Text>
                  </View>
                  <View style={{flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center', marginTop: 3}}>
                    <MaterialIcons name="access-time" color="#C6D2D2" size={14} style={{marginRight: 2}}/>
                    <Text style={{color: '#C6D2D2', fontSize: 10}}>{raceDate}</Text>
                  </View>
                </View>
                {won !== null &&
                <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center', backgroundColor: 'transparent'}}>
                  <View style={[{backgroundColor: 'transparent', paddingVertical: 10,
                  paddingHorizontal: 10, borderRadius:10, marginTop: 3}, 
                  won ? styles.winBackgroundColor : 
                  styles.loseBackgroundColor]}>
                    <Text style={{color: '#fff'}}>{won ? 'Gagné' : 'Perdu'}</Text>
                  </View>
                </View>
                }
                
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', marginLeft: 10, marginBottom: 10}}>
                  {
                    betType === "simple" && <Image style={styles.betTypeImage} source={require('./../assets/images/simple.png')}/>
                  }
                  {
                    betType === "couplé" && <Image style={styles.betTypeImage} source={require('./../assets/images/couple.png')}/>
                  }
                  {
                    betType === "quinté" && <Image style={styles.betTypeImage} source={require('./../assets/images/quinte.png')}/>
                  }
                <View style={{height: '100%', backgroundColor: 'transparent', marginRight: 2}}>
                  <Text style={{color: "#C6D2D2", fontSize: 8}}>({category})</Text>
                </View>
                {bet.map((result, index)=> (
                    <View style={[{borderRadius: 100, width: 30, height: 30, 
                      flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 2},
                      , won !== null && (won ? styles.winBackgroundColor : styles.loseBackgroundColor)]} key={index}>
                      <Text style={won !== null && {color: '#fff'}}>
                        {result}
                      </Text>
                    </View>        
                  ))
                }
              </View>
            </View>
          )
        }
        {
          type !== "image" && (
            <Divider />
          )
        }
        <View style={{ flexDirection: 'row', padding: 5}}>
          <TouchableOpacity onPress={null}>
            <Text style={{color: '#757575'}}>{nbLikes} jaimes</Text>
          </TouchableOpacity>
          <Text style={{color: '#757575'}}> · </Text>
          <TouchableOpacity onPress={null}>
            <Text style={{color: '#757575'}}>{nbComments} commentaires</Text>
          </TouchableOpacity>
          {
            type === "bet" && (
              <React.Fragment>
                <Text style={{color: '#757575'}}> · </Text>
                <TouchableOpacity onPress={null}>
                  <Text style={{color: '#757575'}}>{nbCopiedBets} ont joué</Text>
                </TouchableOpacity>
              </React.Fragment>
            )
          }
        </View>
        <Divider />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
          <Button 
            icon="thumb-up-outline" 
            mode="text"
            uppercase={false}
            labelStyle={[{fontWeight: 'bold'},alreadyLiked ? {color: '#194A4C'} : {color: '#757575'}]}
            onPress={()=> handleLikePost(id, !alreadyLiked)}>J'aime
          </Button>
          <Button 
            icon="comment-text-outline"  
            uppercase={false}
            mode="text"
            labelStyle={{fontWeight: 'bold', color: '#757575'}}
            onPress={() => console.log('Pressed')}>Commenter
          </Button>
          {
            type === "bet" && (
              <Button 
                icon="cash-usd"  
                uppercase={false}
                mode="text"
                labelStyle={{fontWeight: 'bold', color: '#757575'}}
                onPress={()=>Linking.openURL(`${PMU_URL}/${locationCode}/${raceCode}`)}>Jouer
              </Button>
            )
          }
        </View>
    </View>
  )
}


function isWin(betType, betCategory, bet, betResults){
  let podium
  switch(betType){
    case 'simple':
      switch(betCategory){
        case 'placé':
          podium = betResults.slice(0, 3)
          return podium.includes(bet[0])
        case 'gagnant':
          return betResults[0] === bet[0]
      }
      break;
    case 'couplé':
      switch(betCategory){
        case 'gagnant':
          podium = betResults.slice(0, 2)
          return hasSubArray(podium, bet)
        case 'placé':
          podium = betResults.slice(0, 3)
          return hasSubArray(podium, bet)
        case 'ordre':
          return bet[0] === betResults[0] && bet[1] === betResults[1]
      }
      break;
    case 'quinté':
      switch(betCategory){
        case 'ordre':
          return bet[0] === betResults[0] && bet[1] === betResults[1] && bet[2] === betResults[2]
          && bet[3] === betResults[3] && bet[4] === betResults[4] 
        case 'désordre':
          return hasSubArray(betResults, bet)
      }
      break;
  }
}

function hasSubArray(master, sub) {
  return !sub.some(r=> !master.includes(r))
}


const styles = StyleSheet.create({
    container: {
      marginTop: 10,
      marginBottom: 10,
      padding: 4
    },
    date: {
      fontSize: 10,
      color: '#757575'
    },
    interactionsNbContainer: {
      flexDirection: 'row',
      color: '#757575',
    },
    postText: {
      marginTop: 5,
      marginBottom: 5,
    },
    image: {
      width: 50,
      height: 50,
    },
    betHeader: {
      margin: 8,
      flexDirection: 'row',
      backgroundColor: 'transparent'
    },
    betDesc: {
      margin: 5,
      flexDirection: 'column', 
      justifyContent: 'space-between', 
      backgroundColor: 'transparent',
    },
    codeContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      borderRadius:10,
      backgroundColor: "#113435"
    },
    raceCode: {
      color: "#fff",
      fontSize: 24,
      fontWeight: 'bold',
      fontStyle: 'italic',
    },
    winBackgroundColor: {
      backgroundColor: '#53EC7E'
    },
    loseBackgroundColor: {
      backgroundColor: '#EC5353'
    },
    betTypeImage: {
      width:  85,
      height: 30,
      marginRight: 2
    }
  })