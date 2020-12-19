import React, { ReactPropTypes } from 'react'
import { View } from '../components/Themed'
import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { Avatar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

// for testing purposes
const users = [
  {
    name: 'Joe Biden',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxBQF3-OpG82AZOw8GM5CZ1eMlSH9-hK7wUQ&usqp=CAU',
    comment: 'Make America great again!!',
    datetime: new Date('2020-11-24T09:09:00'),
  },
  {
    name: 'Emmanuel Macron',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Emmanuel_Macron_%28cropped%29.jpg/220px-Emmanuel_Macron_%28cropped%29.jpg',
    comment: "Mes concitoyen(ne)s, l'heure est grave...",
    datetime: new Date('2020-02-24T15:00:00'),
  },
  {
    name: 'Donald Trump',
    avatar:
      'https://www.challenges.fr/assets/img/2018/05/28/cover-r4x3w1000-5b0fbf7445ff2-trump-annonce-l-arrivee-d-emissaires-us-en-coree-du-nord.jpg',
    comment: 'This election is a fraud!!',
    datetime: new Date('2020-11-23T15:00:00'),
  },
  {
    name: 'Bruce Lee',
    avatar:
      'https://www.jeetkunedoconcept.fr/wp-content/uploads/sites/11/2018/08/bruce-lee-4-1024x576.jpg',
    comment: 'Be water, my friend.',
    datetime: new Date('1972-11-24T12:30:00'),
  },
  {
    name: 'John Cena',
    avatar:
      'https://i.kym-cdn.com/entries/icons/facebook/000/007/797/john-cena-missing-777x437.jpg',
    comment: "You can't see me!!",
    datetime: new Date('2019-08-31T15:00:00'),
  },
  {
    name: 'Dwayne "The Rock" Johnson',
    avatar:
      'https://images.ladbible.com/resize?type=jpeg&url=http://beta.ems.ladbiblegroup.com/s3/content/a87d98d35f68c2fc94b0604a44d2e0dc.png&quality=70&width=720&aspectratio=16:9&extend=white',
    comment: 'If You Smell, What The Rock Is Cooking',
    datetime: new Date('2018-06-07T15:00:00'),
  },
  {
    name: 'Uncle Roger',
    avatar:
      'https://monodramatic.com/wp-content/uploads/2020/09/uncle_roger_reaction_rice_bbc_%C2%A9uncleroger_youtube_video-850x567.jpg',
    comment: "Aiyaaaa!! That's just disgusting!!",
    datetime: new Date('2020-11-25T09:09:00'),
  },
  {
    name: 'Gordon Ramsay',
    avatar:
      'https://pyxis.nymag.com/v1/imgs/8d7/8d1/a6b94063a43171a380fb9c6b1c4da37f8f-20-gordon-ramsay.rsquare.w1200.jpg',
    comment: "Oh jesus!! THAT'S F******* RAWWW!!!",
    datetime: new Date('2020-12-04T15:00:00'),
  },
  // more users here
]

function GetRoomTitleShort(title) {
  if (title.length > 25) return comment.substring(0, 25) + '...'
  else return title
}

function GetMessageShort(comment) {
  if (comment.length > 35) return comment.substring(0, 34) + '...'
  else return comment
}

function PublishedDate(dt) {
  let now = new Date()
  let secondByMs = 1000
  let minuteByMs = 60 * secondByMs
  let hourByMs = 60 * minuteByMs

  let duration = (now.getTime() - dt.getTime()) / hourByMs
  let hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()
  let mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()
  let oclock = hours + 'h' + mins
  if (duration < 24) return `Aujourd'hui, à ${oclock}`
  else if (24 <= duration && duration < 48) return `Hier, à ${oclock}`
  else {
    let weekdays = [
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
      'Dimanche',
    ]
    let months = [
      'Jan',
      'Fev',
      'Mars',
      'Avr',
      'Mai',
      'Juin',
      'Jui',
      'Aout',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    let weekday = weekdays[dt.getDay()]
    let day = dt.getDate()
    let month = months[dt.getMonth()]
    let year =
      now.getFullYear() === dt.getFullYear() ? '' : ' ' + dt.getFullYear()
    return `${weekday} ${day} ${month}${year}, à ${oclock}`
  }
}

export default function ChatList({ navigation }) {
  return (
    <ScrollView>
      {users.map((u, i) => {
        return (
          <TouchableOpacity
            key={i}
            style={styles.containerChatRoomItem}
            onPress={() =>
              navigation.navigate('ChatRoom', {
                title: (
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                    }}>
                    <Avatar.Image size={45} source={{ uri: u.avatar }} />
                    <View
                      style={{
                        marginStart: 10,
                        flexDirection: 'column',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                      }}>
                      <Text style={styles.titleStyle}>
                        {GetRoomTitleShort(u.name)}
                      </Text>
                    </View>
                  </View>
                ),
              })
            }>
            <Avatar.Image size={40} source={{ uri: u.avatar }} />
            <View style={{ marginStart: 10, ...styles.viewStyle }}>
              <Text style={styles.nameStyle}>{u.name}</Text>
              <View style={styles.viewStyle}>
                <Text style={styles.lastMessageStyle}>
                  {GetMessageShort(u.comment)}
                </Text>
                <Text style={styles.publishedDateStyle}>
                  - {PublishedDate(u.datetime)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerRightIcon: {
    padding: 10,
  },
  containerChatRoomItem: {
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    paddingStart: 10,
    paddingEnd: 5,
    paddingTop: 10,
    paddingBottom: 10,
    elevation: 4,
  },
  titleStyle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
  },
  nameStyle: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  lastMessageStyle: {
    flex: 1,
    fontSize: 10,
  },
  publishedDateStyle: {
    flex: 1,
    color: 'grey',
    fontSize: 8,
  },
  viewStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)', // transparent background
  },
})
