import React from 'react'
import { View, Text, Image} from './Themed'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Avatar, Divider, Button, Card } from 'react-native-paper'
import {
  MaterialIcons,
} from '@expo/vector-icons'


export default function Post(props) {

  const { postID, username, photoURL, date, text, nbLikes, nbComments, type, content } = props
  
  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <Avatar.Image source={{  uri: photoURL  }} size={48}/>
          <View style={{margin: 5}}>
            <Text style={{ fontWeight: 'bold' }}>{username}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <Text style={styles.postText}>{text}</Text>
        {
          type === "image" && (
            <Card>
              <Card.Cover source={{ uri: content.image }} />
            </Card>
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
    },
  })