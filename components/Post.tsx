import React, {useRef, useEffect} from 'react'
import { View, Text, Image} from './Themed'
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Avatar, Divider, Button, Card } from 'react-native-paper'
import Bet from './Post/Pronostic'
import {
  MaterialIcons,
} from '@expo/vector-icons'
import timeAgoFormat from '../utils/timeAgoFormatter'


export default function Post(props) {

  const { postID, username, photoURL, date, text, nbLikes, nbComments, type, 
  image, content} = props

  console.log(image)

  let responseObjectList = [];
  let totalVotes = 0;
  if(type === "survey"){

    Object.keys(content.responses).forEach((response)=>{
      totalVotes += content.responses[response]
    })

    responseObjectList = Object.keys(content.responses).map((response, i) => {
      return {response: response, percentage: Math.round((content.responses[response]/totalVotes)*100)}
    })
  }


  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <Avatar.Image source={{  uri: photoURL  }} size={48}/>
          <View style={{margin: 5}}>
            <TouchableOpacity onPress={null}>
              <Text style={{ fontWeight: 'bold' }}>{username}</Text>
            </TouchableOpacity>
            <Text style={styles.date}>{timeAgoFormat(date)}</Text>
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
              <FlatList
                data={responseObjectList}
                renderItem={({item}) => (
                  <View style={{backgroundColor: "#E0E0E0", width: `${item.percentage}%`, 
                  marginTop: 2, marginBottom: 2,padding: 4, flexDirection: 'row', borderRadius: 15}} >
                      <View numberOfLines={1} style={{position: 'relative', flexDirection: 'row', backgroundColor: '#1fe0'}}>
                        <Text style={{fontWeight: 'bold'}}>{`${item.percentage}%`} </Text>
                        <Text>{item.response}</Text>
                      </View>
                  </View>
                )}
              />
              <Text style={{color: '#757575'}}>{totalVotes} votes · {content.expirationDate}</Text>
            </React.Fragment>

          )
        }
        {
          type === "bet" && (
            <Bet betID={1} userID={1}/>
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
                  <Text style={{color: '#757575'}}>{content.nbCopiedBet} ont joué</Text>
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
            labelStyle={{fontWeight: 'bold', color: '#757575'}}
            onPress={() => console.log('Pressed')}>J'aime
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
                onPress={() => console.log('Pressed')}>Jouer
              </Button>
            )
          }
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      elevation: 0,
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
    }
  })